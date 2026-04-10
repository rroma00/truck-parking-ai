import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLot } from '../context/LotContext';

const STATUS_COLORS = {
    available: '#10B981',
    occupied: '#EF4444',
    reserved: '#F59E0B',
    unavailable: '#6B7280'
};

const Spaces = () => {
    const { lotDetails } = useLot();
    
    // Core State
    const [spots, setSpots] = useState([]);
    const [selectedSpotId, setSelectedSpotId] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgroundOpacity, setBackgroundOpacity] = useState(90);
    const [viewMode, setViewMode] = useState('canvas');
    
    // Canvas State
    const [zoomLevel, setZoomLevel] = useState(100);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [showLabels, setShowLabels] = useState(true);

    // Interaction State
    const [dragMode, setDragMode] = useState('none'); // 'none', 'pan', 'spot', 'create', 'rotate'
    const [isResizing, setIsResizing] = useState(false);
    const [resizeCorner, setResizeCorner] = useState(null);
    const [resizeAnchor, setResizeAnchor] = useState(null);
    
    const [ghostRect, setGhostRect] = useState(null);
    
    const svgRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const dragInfo = useRef({
        startX: 0,
        startY: 0,
        startPanX: 0,
        startPanY: 0,
        startSpotX: 0,
        startSpotY: 0,
        startAngle: 0,
        startRotation: 0,
        moved: false,
        createStartX: 0,
        createStartY: 0
    });

    // Load / Save
    useEffect(() => {
        const savedLayout = localStorage.getItem('parkingLayout');
        if (savedLayout) {
            try {
                const parsed = JSON.parse(savedLayout);
                setSpots(parsed.spots || []);
                setBackgroundImage(parsed.backgroundImage || null);
                setBackgroundOpacity(parsed.backgroundOpacity ?? 90);
                if (parsed.canvasZoom) setZoomLevel(parsed.canvasZoom);
                if (parsed.canvasPan) setPan(parsed.canvasPan);
                if (parsed.snapToGrid !== undefined) setSnapToGrid(parsed.snapToGrid);
                if (parsed.showLabels !== undefined) setShowLabels(parsed.showLabels);
            } catch (err) {
                console.error("Failed to load layout");
            }
        }
    }, []);

    const saveLayout = () => {
        const data = { spots, backgroundImage, backgroundOpacity, canvasZoom: zoomLevel, canvasPan: pan, snapToGrid, showLabels };
        localStorage.setItem('parkingLayout', JSON.stringify(data));
        alert('Layout saved successfully!');
    };

    // Coordinate mapping
    const getLogicalPos = (clientX, clientY) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const ctm = svgRef.current.getScreenCTM().inverse();
        const svgPt = pt.matrixTransform(ctm);
        return {
            x: (svgPt.x - pan.x) / (zoomLevel / 100),
            y: (svgPt.y - pan.y) / (zoomLevel / 100)
        };
    };

    const getCanvasPos = (e) => getLogicalPos(e.clientX, e.clientY);

    // --- MOUSE EVENTS ---
    
    const handleBackgroundMouseDown = (e) => {
        if (viewMode !== 'canvas') return;
        
        const pt = getCanvasPos(e);
        
        if (dragMode === 'create') {
            dragInfo.current.createStartX = pt.x;
            dragInfo.current.createStartY = pt.y;
            dragInfo.current.moved = false;
            setGhostRect({ x: pt.x, y: pt.y, w: 0, h: 0 });
            return;
        }

        setDragMode('pan');
        dragInfo.current.startX = e.clientX;
        dragInfo.current.startY = e.clientY;
        dragInfo.current.startPanX = pan.x;
        dragInfo.current.startPanY = pan.y;
        setSelectedSpotId(null);
    };

    const handleSpotMouseDown = (e, spot) => {
        if (dragMode === 'create' || isResizing) return;
        e.stopPropagation();

        setDragMode('spot');
        setSelectedSpotId(spot.id);
        
        dragInfo.current.startX = e.clientX;
        dragInfo.current.startY = e.clientY;
        dragInfo.current.startSpotX = spot.x;
        dragInfo.current.startSpotY = spot.y;
        dragInfo.current.moved = false;
    };

    const handleRotationMouseDown = (e, spot) => {
        if (dragMode === 'create' || isResizing) return;
        e.stopPropagation();
        e.preventDefault();

        setDragMode('rotate');
        setSelectedSpotId(spot.id);

        const pt = getCanvasPos(e);
        const centerX = spot.x + spot.width / 2;
        const centerY = spot.y + spot.height / 2;
        const angle = Math.atan2(pt.y - centerY, pt.x - centerX) * (180 / Math.PI);

        dragInfo.current.startAngle = angle;
        dragInfo.current.startRotation = spot.rotation || 0;
    };

    const handleResizeStart = (e, spot, corner) => {
        if (dragMode === 'rotate' || dragMode === 'create' || dragMode === 'spot') return;
        e.stopPropagation();
        
        setIsResizing(true);
        setResizeCorner(corner);
        setSelectedSpotId(spot.id);
        
        const anchors = {
            topLeft: { x: spot.x + spot.width, y: spot.y + spot.height },
            topRight: { x: spot.x, y: spot.y + spot.height },
            bottomLeft: { x: spot.x + spot.width, y: spot.y },
            bottomRight: { x: spot.x, y: spot.y }
        };
        setResizeAnchor(anchors[corner]);
    };

    const handleGlobalMouseMove = useCallback((e) => {
        const info = dragInfo.current;
        
        const dx = e.clientX - info.startX;
        const dy = e.clientY - info.startY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            info.moved = true;
        }

        if (isResizing && selectedSpotId && resizeAnchor) {
            let pt = getCanvasPos(e);
            let mouseX = pt.x;
            let mouseY = pt.y;

            if (snapToGrid) {
                mouseX = Math.round(mouseX / 10) * 10;
                mouseY = Math.round(mouseY / 10) * 10;
            }

            let newX = Math.min(mouseX, resizeAnchor.x);
            let newY = Math.min(mouseY, resizeAnchor.y);
            let newWidth = Math.abs(mouseX - resizeAnchor.x);
            let newHeight = Math.abs(mouseY - resizeAnchor.y);

            if (newWidth < 40) newWidth = 40;
            if (newHeight < 60) newHeight = 60;

            if (resizeCorner === 'topLeft') {
                newX = resizeAnchor.x - newWidth;
                newY = resizeAnchor.y - newHeight;
            } else if (resizeCorner === 'topRight') {
                newY = resizeAnchor.y - newHeight;
            } else if (resizeCorner === 'bottomLeft') {
                newX = resizeAnchor.x - newWidth;
            }

            setSpots(prev => prev.map(s => 
                s.id === selectedSpotId ? { ...s, x: newX, y: newY, width: newWidth, height: newHeight } : s
            ));
            return;
        }

        if (dragMode === 'pan') {
            setPan({ x: info.startPanX + dx, y: info.startPanY + dy });
        } 
        else if (dragMode === 'create' && ghostRect) {
            const pt = getCanvasPos(e);
            let nx = Math.min(info.createStartX, pt.x);
            let ny = Math.min(info.createStartY, pt.y);
            let w = Math.abs(pt.x - info.createStartX);
            let h = Math.abs(pt.y - info.createStartY);

            if (snapToGrid) {
                nx = Math.round(nx / 10) * 10;
                ny = Math.round(ny / 10) * 10;
                w = Math.round(w / 10) * 10;
                h = Math.round(h / 10) * 10;
            }

            setGhostRect({ x: nx, y: ny, w, h });
        }
        else if (dragMode === 'spot' && info.moved && selectedSpotId) {
            let logicalDx = dx / (zoomLevel / 100);
            let logicalDy = dy / (zoomLevel / 100);

            let nx = info.startSpotX + logicalDx;
            let ny = info.startSpotY + logicalDy;

            if (snapToGrid) {
                nx = Math.round(nx / 10) * 10;
                ny = Math.round(ny / 10) * 10;
            }

            setSpots(prev => prev.map(s => 
                s.id === selectedSpotId ? { ...s, x: nx, y: ny } : s
            ));
        }
        else if (dragMode === 'rotate' && selectedSpotId) {
            const spot = spots.find(s => s.id === selectedSpotId);
            if (!spot) return;

            const pt = getCanvasPos(e);
            const centerX = spot.x + spot.width / 2;
            const centerY = spot.y + spot.height / 2;
            
            const angle = Math.atan2(pt.y - centerY, pt.x - centerX) * (180 / Math.PI);
            let diff = angle - info.startAngle;
            let newRot = info.startRotation + diff;
            
            if (!e.shiftKey) {
                newRot = Math.round(newRot / 15) * 15;
            }

            // Keep within -180 to 180 degrees
            newRot = ((newRot % 360) + 360) % 360;
            if (newRot > 180) newRot -= 360;

            setSpots(prev => prev.map(s => 
                s.id === selectedSpotId ? { ...s, rotation: newRot } : s
            ));
        }
    }, [dragMode, isResizing, ghostRect, selectedSpotId, zoomLevel, pan, snapToGrid, resizeAnchor, resizeCorner, spots]);

    const handleGlobalMouseUp = useCallback(() => {
        if (isResizing) {
            setIsResizing(false);
            setResizeCorner(null);
            setResizeAnchor(null);
            return;
        }

        if (dragMode === 'create') {
            if (ghostRect && ghostRect.w >= 40 && ghostRect.h >= 60) {
                const nextNum = spots.length + 1;
                const newSpot = {
                    id: `S-${Date.now()}`,
                    label: `A-${String(nextNum).padStart(2, '0')}`,
                    x: ghostRect.x,
                    y: ghostRect.y,
                    width: ghostRect.w,
                    height: ghostRect.h,
                    rotation: 0,
                    status: 'available',
                    notes: ''
                };
                setSpots([...spots, newSpot]);
                setSelectedSpotId(newSpot.id);
            }
            setGhostRect(null);
            setDragMode('none');
        } 
        else if (dragMode !== 'none') {
            setDragMode('none');
        }
    }, [dragMode, ghostRect, isResizing, spots]);

    useEffect(() => {
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [handleGlobalMouseMove, handleGlobalMouseUp]);

    // Zoom Controls
    const handleZoomIn = () => setZoomLevel(prev => Math.min(200, prev + 10));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 10));
    const handleZoomReset = () => { setZoomLevel(100); setPan({x:0,y:0}); };
    const handleFitView = () => {
        if (spots.length === 0) {
            handleZoomReset();
            return;
        }
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        spots.forEach(s => {
            if (s.x < minX) minX = s.x;
            if (s.y < minY) minY = s.y;
            if (s.x + s.width > maxX) maxX = s.x + s.width;
            if (s.y + s.height > maxY) maxY = s.y + s.height;
        });

        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        
        const zoomX = rect.width / (maxX - minX + 200);
        const zoomY = rect.height / (maxY - minY + 200);
        const newZoom = Math.max(50, Math.min(200, Math.min(zoomX, zoomY) * 100));

        const cx = minX + (maxX - minX) / 2;
        const cy = minY + (maxY - minY) / 2;

        setZoomLevel(Math.round(newZoom / 10) * 10);
        setPan({
            x: (rect.width / 2) - (cx * (newZoom / 100)),
            y: (rect.height / 2) - (cy * (newZoom / 100))
        });
    };

    // Actions
    const handleDeleteSpot = () => {
        if (!selectedSpotId) return;
        setSpots(spots.filter(s => s.id !== selectedSpotId));
        setSelectedSpotId(null);
    };

    const handleDuplicateSpot = () => {
        if (!selectedSpotId) return;
        const target = spots.find(s => s.id === selectedSpotId);
        const newSpot = { 
            ...target, 
            id: `TMP-${Date.now()}`, 
            label: `${target.label} (copy)`,
            x: target.x + 20, 
            y: target.y + 20 
        };
        setSpots([...spots, newSpot]);
        setSelectedSpotId(newSpot.id);
    };

    const handleAutoNumber = () => {
        const sorted = [...spots].sort((a, b) => {
            if (Math.abs(a.y - b.y) < 30) return a.x - b.x;
            return a.y - b.y;
        });

        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        let r = 0, c = 1, lastY = sorted[0]?.y || 0;

        const maps = {};
        sorted.forEach((s, i) => {
            if (i > 0 && Math.abs(s.y - lastY) > 30) {
                r++; c = 1;
            }
            lastY = s.y;
            maps[s.id] = `${rows[r] || 'Z'}-${String(c).padStart(2, '0')}`;
            c++;
        });

        setSpots(spots.map(s => maps[s.id] ? { ...s, label: maps[s.id] } : s));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => setBackgroundImage(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const selectedSpot = spots.find(s => s.id === selectedSpotId);
    const updateSpot = (id, fields) => {
        setSpots(spots.map(s => s.id === id ? { ...s, ...fields } : s));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] w-full overflow-hidden bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div>
                        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0058be] mb-1">
                            <span>DASHBOARD</span>
                            <span className="material-symbols-outlined text-[12px] text-slate-400">chevron_right</span>
                            <span className="text-[#050f36]">SPACES</span>
                        </nav>
                        <h1 className="text-2xl font-extrabold text-[#050f36] flex items-center gap-3 font-manrope">
                            {lotDetails?.name || 'Downtown Zone A'}
                            <span className="material-symbols-outlined text-[#0058be] text-base cursor-pointer">edit</span>
                        </h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 flex p-1 rounded-xl">
                        <button onClick={() => setViewMode('canvas')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'canvas' ? 'bg-white text-[#050f36] shadow-sm' : 'text-slate-500'}`}><span className="material-symbols-outlined text-sm">grid_view</span> Canvas</button>
                        <button onClick={() => setViewMode('list')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-[#050f36] shadow-sm' : 'text-slate-500'}`}><span className="material-symbols-outlined text-sm">list</span> List</button>
                    </div>
                    <button onClick={saveLayout} className="bg-[#0058be] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">Save Layout</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* SVG Canvas Area */}
                <div className={`flex-1 relative bg-slate-100 overflow-hidden ${viewMode !== 'canvas' ? 'hidden' : 'block'}`}>
                    
                    {/* BETA Button */}
                    <div className="absolute top-6 left-6 border border-slate-200 rounded-full px-5 py-2.5 bg-white/50 backdrop-blur opacity-60 cursor-not-allowed shadow-sm z-10 flex items-center gap-2" title="AI Vision will auto-detect parking spots from your aerial photo. Available in next update.">
                        <span className="material-symbols-outlined text-slate-500 text-sm">psychology</span>
                        <span className="text-xs font-bold text-slate-500">AI Detect Spots <span className="ml-1 text-[9px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase">Coming Soon</span></span>
                    </div>

                    <svg
                        ref={svgRef}
                        viewBox="0 0 1400 800"
                        className="w-full h-full"
                        onMouseDown={handleBackgroundMouseDown}
                        style={{ cursor: dragMode === 'create' ? 'crosshair' : (dragMode === 'pan' ? 'grabbing' : 'grab') }}
                    >
                        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel / 100})`}>
                            {backgroundImage && (
                                <image 
                                    href={backgroundImage} 
                                    opacity={backgroundOpacity / 100}
                                    style={{ pointerEvents: 'none' }}
                                />
                            )}
                            
                            {spots.map(spot => {
                                const isSelected = selectedSpotId === spot.id;
                                const cx = spot.width / 2;
                                const cy = spot.height / 2;

                                return (
                                    <g key={spot.id} transform={`translate(${spot.x}, ${spot.y}) rotate(${spot.rotation || 0}, ${cx}, ${cy})`}>
                                        <g onMouseDown={(e) => handleSpotMouseDown(e, spot)} style={{ cursor: isSelected ? 'move' : 'pointer' }}>
                                            <rect
                                                width={spot.width}
                                                height={spot.height}
                                                rx="4"
                                                fill="white"
                                                fillOpacity="0.85"
                                                stroke={STATUS_COLORS[spot.status] || '#10B981'}
                                                strokeWidth={isSelected ? "4" : "3"}
                                            />
                                            {showLabels && (
                                                <text x={cx} y={24} textAnchor="middle" className="text-[11px] font-bold fill-slate-900">{spot.label}</text>
                                            )}
                                            
                                            <rect x={cx - 24} y={spot.height - 16} width="48" height="10" rx="5" fill={STATUS_COLORS[spot.status] || '#10B981'} />
                                        </g>

                                        {isSelected && dragMode !== 'create' && !isResizing && (
                                            <g 
                                                transform={`translate(${spot.width + 15}, -15) rotate(-${spot.rotation || 0})`} 
                                                onMouseDown={(e) => handleRotationMouseDown(e, spot)} 
                                                style={{ cursor: dragMode === 'rotate' ? 'grabbing' : 'grab' }}
                                                className="active:cursor-grabbing"
                                            >
                                                <circle r="16" fill="transparent" />
                                                <circle r="10" fill="white" stroke="#0058be" strokeWidth="2" className="shadow-sm" />
                                                <text x="0" y="3.5" fontSize="11" textAnchor="middle" fill="#0058be" fontWeight="900">↻</text>
                                            </g>
                                        )}

                                        {isSelected && dragMode !== 'create' && (
                                            <g className="resize-handles">
                                                <rect x="-4" y="-4" width="8" height="8" fill="white" stroke="#10B981" strokeWidth="2" style={{ cursor: 'nwse-resize' }} transform={`rotate(-${spot.rotation || 0}, 0, 0)`} onMouseDown={(e) => handleResizeStart(e, spot, 'topLeft')} />
                                                <rect x={spot.width - 4} y="-4" width="8" height="8" fill="white" stroke="#10B981" strokeWidth="2" style={{ cursor: 'nesw-resize' }} transform={`rotate(-${spot.rotation || 0}, ${spot.width}, 0)`} onMouseDown={(e) => handleResizeStart(e, spot, 'topRight')} />
                                                <rect x="-4" y={spot.height - 4} width="8" height="8" fill="white" stroke="#10B981" strokeWidth="2" style={{ cursor: 'nesw-resize' }} transform={`rotate(-${spot.rotation || 0}, 0, ${spot.height})`} onMouseDown={(e) => handleResizeStart(e, spot, 'bottomLeft')} />
                                                <rect x={spot.width - 4} y={spot.height - 4} width="8" height="8" fill="white" stroke="#10B981" strokeWidth="2" style={{ cursor: 'nwse-resize' }} transform={`rotate(-${spot.rotation || 0}, ${spot.width}, ${spot.height})`} onMouseDown={(e) => handleResizeStart(e, spot, 'bottomRight')} />
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                            
                            {ghostRect && dragMode === 'create' && (
                                <rect 
                                    x={ghostRect.x} y={ghostRect.y} 
                                    width={ghostRect.w} height={ghostRect.h} 
                                    fill="transparent" stroke="#0058be" strokeWidth="2" strokeDasharray="4 4" 
                                />
                            )}
                        </g>
                    </svg>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-[#1E293B] text-white rounded-full px-5 py-2.5 shadow-xl select-none z-20">
                        <button onClick={handleZoomOut} className="hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition"><span className="material-symbols-outlined text-lg">remove</span></button>
                        <span className="font-bold text-sm font-mono min-w-[50px] text-center">{Math.round(zoomLevel)}%</span>
                        <button onClick={handleZoomIn} className="hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition"><span className="material-symbols-outlined text-lg">add</span></button>
                        <div className="w-px h-5 bg-white/20 mx-1"></div>
                        <button onClick={handleZoomReset} className="hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition"><span className="material-symbols-outlined text-lg">refresh</span></button>
                        <button onClick={handleFitView} className="hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition"><span className="material-symbols-outlined text-lg">fit_screen</span></button>
                    </div>
                </div>

                {viewMode === 'list' && (
                    <div className="flex-1 overflow-auto p-8 bg-slate-50 border-r border-slate-200">
                        <table className="w-full text-left border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
                            <thead className="bg-[#f8fafc] border-b border-slate-200">
                                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-4">Spot ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Dimensions</th>
                                    <th className="px-6 py-4">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spots.map(s => (
                                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-[#050f36]">{s.label}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider" style={{ backgroundColor: STATUS_COLORS[s.status] + '20', color: STATUS_COLORS[s.status] }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">{Math.round(s.width)}×{Math.round(s.height)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{s.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <aside className="w-[360px] flex flex-col overflow-y-auto bg-white shrink-0 scrollbar-hide border-l border-slate-200 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
                    
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-[#050f36] mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">landscape</span>
                            AERIAL PHOTO
                        </h3>
                        <div className="space-y-4">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                            
                            {!backgroundImage ? (
                                <button onClick={() => fileInputRef.current.click()} className="w-full h-[120px] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-[#0058be] transition-colors">
                                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                    <span className="text-xs font-bold">Upload Aerial Image</span>
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <div className="w-[100px] h-[100px] rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                                        <img src={backgroundImage} className="w-full h-full object-cover" alt="Aerial Preview" />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 overflow-hidden py-1">
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[11px] font-semibold text-slate-600">Opacity: {backgroundOpacity}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" value={backgroundOpacity} onChange={e => setBackgroundOpacity(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0058be]" />
                                        </div>
                                        <div className="flex gap-2 w-full mt-2">
                                            <button onClick={() => fileInputRef.current.click()} className="flex-1 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50">Replace</button>
                                            <button onClick={() => setBackgroundImage(null)} className="flex-1 py-1.5 bg-white border border-red-200 rounded text-xs font-semibold text-red-600 hover:bg-red-50">Clear</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-[#050f36] mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">map</span>
                            MAPPING TOOLS
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <button onClick={() => { setDragMode(dragMode === 'create' ? 'none' : 'create'); setSelectedSpotId(null); }} className={`h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border-2 transition-all ${dragMode === 'create' ? 'bg-[#0058be] text-white border-[#0058be] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#0058be]'}`}>
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                {dragMode === 'create' ? 'Drawing...' : 'Add Spot'}
                            </button>
                            <button onClick={handleDeleteSpot} disabled={!selectedSpotId} className={`h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border-2 transition-all ${!selectedSpotId ? 'bg-white text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}>
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                Delete
                            </button>
                            <button onClick={handleDuplicateSpot} disabled={!selectedSpotId} className={`h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border-2 transition-all ${!selectedSpotId ? 'bg-white text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:border-[#0058be]'}`}>
                                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                Duplicate
                            </button>
                            <button onClick={handleAutoNumber} disabled={spots.length === 0} className={`h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border-2 transition-all ${spots.length === 0 ? 'bg-white text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:border-[#0058be]'}`}>
                                <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                                Auto-No
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center justify-between py-2 cursor-pointer group">
                                <span className="text-xs font-semibold text-slate-700">Snap to Grid</span>
                                <div className={`w-8 h-4.5 rounded-full relative transition-colors ${snapToGrid ? 'bg-[#0058be]' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-[2px] right-[2px] w-3.5 h-3.5 bg-white rounded-full transition-transform ${snapToGrid ? '' : '-translate-x-[14px]'}`} />
                                </div>
                                <input type="checkbox" className="hidden" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} />
                            </label>
                            <label className="flex items-center justify-between py-2 cursor-pointer group">
                                <span className="text-xs font-semibold text-slate-700">Show Spot Labels</span>
                                <div className={`w-8 h-4.5 rounded-full relative transition-colors ${showLabels ? 'bg-[#0058be]' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-[2px] right-[2px] w-3.5 h-3.5 bg-white rounded-full transition-transform ${showLabels ? '' : '-translate-x-[14px]'}`} />
                                </div>
                                <input type="checkbox" className="hidden" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} />
                            </label>
                        </div>
                    </div>

                    {selectedSpot && (
                        <div className="p-6 bg-[#f8fafc] flex-1">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-[#050f36]">SPOT SELECTED</h3>
                                <button onClick={() => setSelectedSpotId(null)} className="text-slate-400 hover:text-slate-700"><span className="material-symbols-outlined text-lg">close</span></button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-medium text-slate-500 block mb-1">Spot ID</label>
                                        <input type="text" value={selectedSpot.label} onChange={e => updateSpot(selectedSpot.id, { label: e.target.value })} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm font-bold text-[#050f36] focus:border-[#0058be] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-slate-500 block mb-1">Status</label>
                                        <select value={selectedSpot.status} onChange={e => updateSpot(selectedSpot.id, { status: e.target.value })} style={{ color: STATUS_COLORS[selectedSpot.status] || '#10B981' }} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-2 text-sm font-bold focus:border-[#0058be] outline-none">
                                            <option value="available">Available</option>
                                            <option value="occupied">Occupied</option>
                                            <option value="reserved">Reserved</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] font-medium text-slate-500 block mb-1">Rotation (°)</label>
                                        <input type="number" value={Math.round(selectedSpot.rotation || 0)} onChange={e => updateSpot(selectedSpot.id, { rotation: Number(e.target.value) || 0 })} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm font-medium text-slate-700 focus:border-[#0058be] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-slate-500 block mb-1">Width</label>
                                        <input type="number" min="40" value={Math.round(selectedSpot.width)} onChange={e => updateSpot(selectedSpot.id, { width: Math.max(40, Number(e.target.value)) })} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm font-medium text-slate-700 focus:border-[#0058be] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-slate-500 block mb-1">Height</label>
                                        <input type="number" min="60" value={Math.round(selectedSpot.height)} onChange={e => updateSpot(selectedSpot.id, { height: Math.max(60, Number(e.target.value)) })} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm font-medium text-slate-700 focus:border-[#0058be] outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-medium text-slate-500 block mb-1">Operational Notes</label>
                                    <textarea value={selectedSpot.notes} onChange={e => updateSpot(selectedSpot.id, { notes: e.target.value })} placeholder="Internal notes..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-3 text-sm h-24 resize-none focus:border-[#0058be] outline-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default Spaces;
