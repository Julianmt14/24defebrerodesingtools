import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const SCREW_DIAMETERS = ['1/4', '3/8', '1/2', '5/8', '3/4', '7/8', '1', '1 1/8', '1 1/4', '1 1/2', '2', '2 1/2', '6 1/2', '6 3/4', '7'];
const DIAMETER_VALUES = {
    '1/4': 0.25, '3/8': 0.375, '1/2': 0.5, '5/8': 0.625, '3/4': 0.75, '7/8': 0.875,
    '1': 1, '1 1/8': 1.125, '1 1/4': 1.25, '1 1/2': 1.5, '2': 2, '2 1/2': 2.5,
    '6 1/2': 6.5, '6 3/4': 6.75, '7': 7
};

const ALL_LENGTHS = [
    1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.5, 6.75, 7
];

const LENGTH_LABELS = {
    1: '1', 1.25: '1 1/4', 1.5: '1 1/2', 1.75: '1 3/4', 2: '2', 2.25: '2 1/4', 2.5: '2 1/2', 2.75: '2 3/4',
    3: '3', 3.25: '3 1/4', 3.5: '3 1/2', 3.75: '3 3/4', 4: '4', 4.25: '4 1/4', 4.5: '4 1/2', 4.75: '4 3/4',
    5: '5', 5.25: '5 1/4', 5.5: '5 1/2', 5.75: '5 3/4', 6: '6', 6.5: '6 1/2', 6.75: '6 3/4', 7: '7'
};

const AVAILABLE_LENGTHS_BY_DIAMETER = {
    '1/2': [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5],
    '5/8': [1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6],
    '3/4': [1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6],
    '7/8': [2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6],
    '1': [2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.5, 6.75, 7],
    '1 1/8': [2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.5, 6.75, 7],
    '1 1/4': [2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6],
    '1 1/2': [3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.5, 6.75, 7],
};

const DimensionarTornillos = () => {
    const navigate = useNavigate();

    // Form state
    const [diametro, setDiametro] = useState(SCREW_DIAMETERS[0]);
    const [laminas, setLaminas] = useState(['', '']);
    const [arandelas, setArandelas] = useState(1);
    const [wasa, setWasa] = useState(0);
    const [resultadoLargo, setResultadoLargo] = useState(null);
    const [resultadoOMaximo, setResultadoOMaximo] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [referenceName, setReferenceName] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // List modal state
    const [showListModal, setShowListModal] = useState(false);
    const [savedCalculations, setSavedCalculations] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);

    const anchoTuerca = (DIAMETER_VALUES[diametro] * 25.4).toFixed(2);
    const ANCHO_ARANDELA = 3;
    const ANCHO_WASA = 7;

    const resetResult = () => {
        setResultadoLargo(null);
        setResultadoOMaximo(null);
        setSaveSuccess(false);
    };

    const handleChangeLamina = (index, value) => {
        const newLaminas = [...laminas];
        newLaminas[index] = value;
        setLaminas(newLaminas);
        resetResult();
    };

    const handleAddLamina = () => {
        setLaminas([...laminas, '']);
        resetResult();
    };

    const handleRemoveLamina = (index) => {
        if (laminas.length > 2) {
            setLaminas(laminas.filter((_, i) => i !== index));
            resetResult();
        }
    };

    const handleCalcularDimensiones = () => {
        // Sumar espesores de láminas
        const sumaLaminas = laminas.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);

        // Sumar grosor de arandelas (cantidad * 3mm)
        const sumaArandelas = arandelas * ANCHO_ARANDELA;

        // Sumar grosor de wasa (cantidad * 7mm)
        const sumaWasa = wasa * ANCHO_WASA;

        // Ancho de la tuerca
        const tuercaNumber = parseFloat(anchoTuerca);

        // Largo Total = Láminas + Tuerca + Arandelas + Wasa + 3mm (Borde Libre)
        const largoTotal = sumaLaminas + tuercaNumber + sumaArandelas + sumaWasa + 3;

        // "o máximo" = Láminas + Arandelas - 3mm
        const oMaximo = sumaLaminas + sumaArandelas - 3;

        setResultadoLargo(largoTotal.toFixed(2));
        setResultadoOMaximo(oMaximo.toFixed(2));
        setSaveSuccess(false);
    };

    const handleSaveCalculation = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('access_token'); // The project uses access_token as key
            const data = {
                reference_name: referenceName || `Cálculo ${new Date().toLocaleDateString()}`,
                screw_diameter: diametro,
                plates_thickness: laminas.map(l => parseFloat(l) || 0),
                washers_count: arandelas,
                wasa_count: wasa,
                calculated_length_mm: parseFloat(resultadoLargo),
                recommended_length_in: closestLength || null
            };

            const response = await apiClient.post('/api/v1/tools/screw/', data);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Error al guardar el cálculo');
            }

            setSaveSuccess(true);
            setShowSaveModal(false);
            setReferenceName('');
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al guardar el cálculo.');
        } finally {
            setIsSaving(false);
        }
    };

    const fetchSavedCalculations = async () => {
        try {
            setIsLoadingList(true);
            const token = localStorage.getItem('access_token');
            const response = await apiClient.get('/api/v1/tools/screw/');
            if (response.status !== 200) throw new Error('Failed to fetch');
            setSavedCalculations(response.data);
        } catch (error) {
            console.error('Error fetching calculations:', error);
        } finally {
            setIsLoadingList(false);
        }
    };

    const deleteCalculation = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await apiClient.delete(`/api/v1/tools/screw/${id}`);
            if (response.status !== 204 && response.status !== 200) throw new Error('Failed to delete');
            setSavedCalculations(prev => prev.filter(calc => calc.id !== id));
        } catch (error) {
            console.error('Error deleting calculation:', error);
            alert('Error al eliminar el cálculo');
        }
    };

    const handleLoadCalculation = (calc) => {
        // Load configurations
        setDiametro(calc.screw_diameter);
        setLaminas(calc.plates_thickness || []);

        setArandelas(calc.washers_count !== undefined ? calc.washers_count : 1);
        setWasa(calc.wasa_count || 0);

        // Load calculated results
        setResultadoLargo(calc.calculated_length_mm.toFixed(2));

        // Compute o maximo from the loaded components
        const sumaLaminas = (calc.plates_thickness || []).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
        const sumaArandelas = (calc.washers_count !== undefined ? calc.washers_count : 1) * ANCHO_ARANDELA;
        const oMaximo = sumaLaminas + sumaArandelas - 3; // 3mm free edge in o maximo logic
        setResultadoOMaximo(oMaximo.toFixed(2));

        // Close modal and un-set save reference to allow new save
        setShowListModal(false);
        setReferenceName('');
        setSaveSuccess(false);
    };

    const openListModal = () => {
        setShowListModal(true);
        fetchSavedCalculations();
    };

    const lengthInInches = resultadoLargo ? (parseFloat(resultadoLargo) / 25.4) : null;
    const availableLengths = AVAILABLE_LENGTHS_BY_DIAMETER[diametro] || ALL_LENGTHS;

    // Find closest length (first alternative)
    const closestLengthIndex = lengthInInches ? availableLengths.findIndex(l => l >= lengthInInches) : -1;
    const closestLength = closestLengthIndex !== -1 ? availableLengths[closestLengthIndex] : null;

    // Find second closest length (second alternative)
    const secondClosestLength = (closestLengthIndex !== -1 && closestLengthIndex + 1 < availableLengths.length)
        ? availableLengths[closestLengthIndex + 1]
        : null;

    return (
        <div
            className="min-h-screen pb-24"
            style={{ backgroundColor: '#0b1120', color: '#e2e8f0' }}
        >
            <nav
                className="sticky top-0 z-50 backdrop-blur-md border-b border-[#1c2436]"
                style={{ backgroundColor: 'rgba(7, 12, 24, 0.95)' }}
            >
                <div className="flex items-center p-4 justify-between max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#8ea2d6] hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </button>
                        <div className="bg-indigo-500/20 p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-indigo-400 text-[20px]">hardware</span>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Dimensionar Tornillos</h2>
                    </div>
                    <button
                        onClick={openListModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1f2a3d] hover:bg-[#2a3852] text-slate-300 hover:text-white rounded-xl transition-colors border border-[#1f2a3d] text-sm font-semibold"
                    >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        Ver Guardados
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Columna Izquierda: Imagen */}
                    <div className="bg-[#121b2d] border border-[#1f2a3d] rounded-2xl overflow-hidden flex flex-col shadow-lg items-center justify-start p-4 h-full">
                        <img
                            src="/tornillos-referencia.png"
                            alt="Referencia de tornillo, tuerca y arandelas"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/600x600/111a2b/8ea2d6?text=Coloca+tu+imagen+aqui";
                            }}
                        />
                    </div>

                    {/* Columna Derecha: Configuración */}
                    <div className="bg-[#121b2d] border border-[#1f2a3d] rounded-2xl p-6 flex flex-col shadow-lg min-h-[50vh]">
                        <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2 border-b border-[#1f2a3d] pb-4">
                            <span className="material-symbols-outlined text-indigo-400">tune</span>
                            Configuración del Tornillo
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 content-start">
                            {/* Diametro del Tornillo */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider">
                                    Diámetro del Tornillo (pulg)
                                </label>
                                <select
                                    className="bg-[#0b1120] border border-[#1f2a3d] text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-colors"
                                    value={diametro}
                                    onChange={(e) => setDiametro(e.target.value)}
                                >
                                    {SCREW_DIAMETERS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {laminas.map((lamina, index) => (
                                <div key={`lamina-${index}`} className="flex flex-col gap-1.5 md:col-span-1">
                                    <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                                        <span>Lámina # {index + 1} (mm)</span>
                                        {index > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveLamina(index)}
                                                className="text-red-400 hover:text-red-300 transition-colors flex items-center"
                                                title="Eliminar lámina"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">close</span>
                                            </button>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        step="1.00"
                                        placeholder={`Ej. 12.50`}
                                        className="bg-[#0b1120] border border-[#1f2a3d] text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-colors"
                                        value={lamina}
                                        onChange={(e) => handleChangeLamina(index, e.target.value)}
                                    />
                                </div>
                            ))}

                            {/* Botón Agregar Lámina */}
                            <div className="flex flex-col gap-1.5 md:col-span-1 justify-end">
                                <button
                                    type="button"
                                    onClick={handleAddLamina}
                                    className="h-[42px] border border-dashed border-[#1f2a3d] hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 text-[#8ea2d6] text-sm rounded-lg flex items-center justify-center gap-2 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">add</span>
                                    Añadir Lámina
                                </button>
                            </div>

                            {/* # de Arandelas */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider">
                                    # de Arandelas
                                </label>
                                <select
                                    className="bg-[#0b1120] border border-[#1f2a3d] text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-colors"
                                    value={arandelas}
                                    onChange={(e) => setArandelas(Number(e.target.value))}
                                >
                                    {[1, 2, 3].map(n => (
                                        <option key={n} value={n}>{n} und</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ancho de Arandelas */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider">
                                    Ancho de Arandelas (mm)
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value="3"
                                    className="bg-[#1f2a3d]/50 border border-[#1f2a3d] text-slate-400 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                                />
                            </div>

                            {/* Ancho de Tuerca */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider">
                                    Ancho de Tuerca (mm)
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={anchoTuerca}
                                    className="bg-[#1f2a3d]/50 border border-[#1f2a3d] text-slate-400 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed font-medium"
                                />
                            </div>

                            {/* Wasa (Opcional) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider">
                                    Wasa (Opcional)
                                </label>
                                <select
                                    className="bg-[#0b1120] border border-[#1f2a3d] text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-colors"
                                    value={wasa}
                                    onChange={(e) => { setWasa(Number(e.target.value)); resetResult(); }}
                                >
                                    {[0, 1, 2].map(n => (
                                        <option key={n} value={n}>{n} und</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ancho de Wasa */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider">
                                    Ancho de Wasa (mm)
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value="7"
                                    className="bg-[#1f2a3d]/50 border border-[#1f2a3d] text-slate-400 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>

                        {/* RESULTADO ALERTA */}
                        {resultadoLargo && (
                            <div className="mt-8 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-0 overflow-hidden shadow-inner flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-indigo-500/20">
                                {/* Largo del Tornillo */}
                                <div className="flex-1 p-4 flex items-center gap-4">
                                    <div className="bg-indigo-500/20 p-2.5 rounded-full flex shrink-0">
                                        <span className="material-symbols-outlined text-indigo-400 text-[24px]">straighten</span>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[#8ea2d6] text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">Largo del Tornillo (b+o)</span>
                                        <span className="text-white text-2xl font-bold leading-none">{resultadoLargo} <span className="text-[14px] font-medium text-slate-400">mm</span></span>
                                    </div>
                                </div>

                                {/* O Máximo */}
                                <div className="flex-1 p-4 flex items-center gap-4 bg-indigo-500/5">
                                    <div className="bg-indigo-400/20 p-2.5 rounded-full flex shrink-0">
                                        <span className="material-symbols-outlined text-indigo-300 text-[24px]">compress</span>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[#8ea2d6] text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">o máximo</span>
                                        <span className="text-white text-2xl font-bold leading-none">{resultadoOMaximo} <span className="text-[14px] font-medium text-slate-400">mm</span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* RESULTADO LONGITUDES COMERCIALES */}
                        {resultadoLargo && (
                            <div className="mt-6 bg-[#121b2d] border border-[#1f2a3d] rounded-xl p-5 shadow-lg">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1f2a3d]">
                                    <span className="material-symbols-outlined text-indigo-400">straighten</span>
                                    <h4 className="text-white text-sm font-bold uppercase tracking-wider">
                                        Longitudes Comerciales (pulgadas)
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableLengths.map((len, idx) => {
                                        const isClosest = closestLength === len;
                                        const isSecondClosest = secondClosestLength === len;
                                        return (
                                            <div
                                                key={idx}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isClosest
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                                                    : isSecondClosest
                                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        : 'bg-[#1f2a3d]/40 text-slate-300 border border-[#1f2a3d] hover:bg-[#1f2a3d]'
                                                    }`}
                                            >
                                                {isClosest && <span className="material-symbols-outlined text-[16px]">verified</span>}
                                                {LENGTH_LABELS[len]}"
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    {closestLength && (
                                        <div className="bg-[#0a101d] border border-[#1f2a3d] rounded-lg p-3">
                                            <p className="text-emerald-400/90 text-sm flex items-start gap-2">
                                                <span className="material-symbols-outlined text-[18px] mt-0.5">info</span>
                                                <span>
                                                    Se recomienda la Referencia comercial de <strong className="text-emerald-300 text-base">{diametro}" x {LENGTH_LABELS[closestLength]}"</strong>
                                                    <span className="text-slate-400 ml-1 text-xs">({(closestLength * 25.4).toFixed(2)} mm)</span>
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                    {secondClosestLength && (
                                        <div className="bg-[#0a101d] border border-[#1f2a3d] rounded-lg p-3">
                                            <p className="text-blue-400/90 text-sm flex items-start gap-2">
                                                <span className="material-symbols-outlined text-[18px] mt-0.5">add_circle</span>
                                                <span>
                                                    Segunda Alternativa: <strong className="text-blue-300 text-base">{diametro}" x {LENGTH_LABELS[secondClosestLength]}"</strong>
                                                    <span className="text-slate-400 ml-1 text-xs">({(secondClosestLength * 25.4).toFixed(2)} mm)</span>
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!closestLength && lengthInInches && (
                                    <div className="mt-4 bg-[#1a1614] border border-amber-500/30 rounded-lg p-3">
                                        <p className="text-amber-400/90 text-sm flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[18px] mt-0.5">warning</span>
                                            <span>
                                                La longitud calculada <strong>({(lengthInInches).toFixed(2)}")</strong> excede las longitudes comerciales disponibles en tabla para este diámetro.
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex gap-4 justify-end pt-4 border-t border-[#1f2a3d] items-center">
                            {saveSuccess && (
                                <span className="text-emerald-400 text-sm flex items-center gap-1.5 mr-auto">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Guardado con éxito
                                </span>
                            )}
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-2.5 rounded-xl border border-[#1f2a3d] text-slate-300 font-semibold hover:bg-[#1f2a3d]/50 transition-colors active:scale-95"
                            >
                                Cancelar
                            </button>
                            {resultadoLargo && (
                                <button
                                    onClick={() => setShowSaveModal(true)}
                                    className="px-6 py-2.5 rounded-xl bg-[#1f2a3d] hover:bg-[#2a3852] text-white font-semibold transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Guardar
                                </button>
                            )}
                            <button
                                onClick={handleCalcularDimensiones}
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">calculate</span>
                                Dimensionar
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Save Modal */}
            {
                showSaveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-[#121b2d] border border-[#1f2a3d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="p-5 border-b border-[#1f2a3d] flex justify-between items-center">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-400">save</span>
                                    Guardar Cálculo
                                </h3>
                                <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div>
                                    <label className="text-[#8ea2d6] text-xs font-bold uppercase tracking-wider mb-2 block">
                                        Nombre de Referencia (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Conexión Viga A3"
                                        className="bg-[#0b1120] border border-[#1f2a3d] text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-colors"
                                        value={referenceName}
                                        onChange={(e) => setReferenceName(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveCalculation();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-[#0b1120] flex justify-end gap-3 border-t border-[#1f2a3d]">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="px-4 py-2 rounded-lg text-slate-300 hover:bg-[#1f2a3d] transition-colors font-medium text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveCalculation}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* List Modal */}
            {
                showListModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#121b2d] border border-[#1f2a3d] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                            <div className="p-5 border-b border-[#1f2a3d] flex justify-between items-center bg-[#0b1120]">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-400">history</span>
                                    Cálculos Guardados
                                </h3>
                                <button onClick={() => setShowListModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>

                            <div className="p-5 overflow-y-auto flex-1 bg-[#121b2d]">
                                {isLoadingList ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                        <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-indigo-500">autorenew</span>
                                        <p>Cargando registros...</p>
                                    </div>
                                ) : savedCalculations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                                        <span className="material-symbols-outlined text-4xl opacity-50">folder_open</span>
                                        <p>No tienes ningún cálculo guardado todavía.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {savedCalculations.map((calc) => (
                                            <div
                                                key={calc.id}
                                                onClick={() => handleLoadCalculation(calc)}
                                                className="bg-[#0b1120] border border-[#1f2a3d] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-500/50 hover:bg-[#121b2d] transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/10"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold text-base mb-1 truncate block max-w-[200px] md:max-w-xs group-hover:text-indigo-400 transition-colors">{calc.reference_name}</span>
                                                    <span className="text-slate-500 text-xs flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                                        {new Date(calc.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 bg-[#121b2d] p-2 px-3 rounded-lg border border-[#1f2a3d]">
                                                    <div className="text-center">
                                                        <div className="text-[#8ea2d6] text-[10px] font-bold uppercase tracking-widest">Ø Tornillo</div>
                                                        <div className="text-indigo-300 font-bold text-sm">{calc.screw_diameter}"</div>
                                                    </div>
                                                    <div className="w-px h-6 bg-[#1f2a3d]"></div>
                                                    <div className="text-center">
                                                        <div className="text-[#8ea2d6] text-[10px] font-bold uppercase tracking-widest">Longitud Real</div>
                                                        <div className="text-emerald-400 font-bold text-sm">{calc.calculated_length_mm} mm</div>
                                                    </div>
                                                    <div className="w-px h-6 bg-[#1f2a3d]"></div>
                                                    <div className="text-center">
                                                        <div className="text-[#8ea2d6] text-[10px] font-bold uppercase tracking-widest">Comercial</div>
                                                        <div className="text-white font-bold text-sm">{calc.recommended_length_in ? `${calc.recommended_length_in}"` : 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering the row load when clicking delete
                                                            deleteCalculation(calc.id);
                                                        }}
                                                        className="text-slate-500 hover:text-red-400 bg-[#121b2d] group-hover:bg-[#0b1120] hover:!bg-red-500/10 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                                        title="Eliminar registro"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div >
    );
};

export default DimensionarTornillos;
