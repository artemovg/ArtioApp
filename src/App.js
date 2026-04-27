import React, { useState, useMemo, useEffect } from 'react';
import { 
  Settings, 
  Layout, 
  Box, 
  Calculator, 
  PlusCircle, 
  ChevronRight, 
  Info,
  Layers,
  Zap,
  Printer,
  Trash2,
  AlertTriangle,
  Sun,
  Home,
  Smartphone,
  Download,
  Save,
  RotateCcw
} from 'lucide-react';

// --- Модуль 1: Калькулятор DIN-рейки ---
const DinRailCalculator = ({ defaults }) => {
  const [widthMm, setWidthMm] = useState(defaults.widthMm);
  const [quantity, setQuantity] = useState(defaults.quantity);
  const MODULE_WIDTH = 18;

  const totalWidth = parseFloat(widthMm) * quantity;
  const modules = totalWidth / MODULE_WIDTH;

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
          <Layers size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">DIN-рейка</h2>
          <p className="text-xs text-gray-500">Ширина в модули (18 мм)</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Ширина (мм)</label>
            <input
              type="number"
              inputMode="decimal"
              value={widthMm}
              onChange={(e) => setWidthMm(e.target.value)}
              placeholder="Напр: 17.5"
              className="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Количество</label>
            <input
              type="number"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
            />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl flex flex-col justify-center items-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Итого модулей</span>
          <span className="text-6xl font-black my-2 tracking-tighter">
            {widthMm ? modules.toFixed(2).replace(/\.00$/, '') : '0'}
          </span>
          <div className="flex items-center gap-2 opacity-70 text-[10px]">
            <Info size={12} />
            <span>Стандарт: 1 мод = 18 мм</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Модуль 2: Калькулятор сечения кабеля ---
const WireCalculator = ({ defaults }) => {
  const [power, setPower] = useState(defaults.power);
  const [voltage, setVoltage] = useState(defaults.voltage);
  const [material, setMaterial] = useState(defaults.material);

  const calculation = useMemo(() => {
    const P = parseFloat(power) || 0;
    const V = parseInt(voltage);
    if (P === 0) return null;
    const cosPhi = 0.95;
    const current = V === 230 ? (P * 1000) / (V * cosPhi) : (P * 1000) / (1.73 * V * cosPhi);
    const copperTable = [
      { s: 1.5, i: 19, cb: 16 }, { s: 2.5, i: 27, cb: 25 }, { s: 4, i: 38, cb: 32 }, { s: 6, i: 50, cb: 40 }, { s: 10, i: 70, cb: 63 },
    ];
    const alumTable = [
      { s: 2.5, i: 20, cb: 16 }, { s: 4, i: 28, cb: 25 }, { s: 6, i: 37, cb: 32 }, { s: 10, i: 51, cb: 40 }, { s: 16, i: 70, cb: 63 },
    ];
    const table = material === 'copper' ? copperTable : alumTable;
    const result = table.find(row => row.i >= current) || { s: '> 10', cb: '?' };
    return { current: current.toFixed(1), ...result };
  }, [power, voltage, material]);

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">Сечение кабеля</h2>
          <p className="text-xs text-gray-500">Подбор по мощности (ПУЭ)</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Мощность (кВт)</label>
            <input
              type="number"
              inputMode="decimal"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none text-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Сеть</label>
            <select 
              value={voltage} 
              onChange={(e) => setVoltage(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none text-lg appearance-none"
            >
              <option value="230">230 В</option>
              <option value="400">400 В</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl">
          {['copper', 'alum'].map((m) => (
            <button
              key={m}
              onClick={() => setMaterial(m)}
              className={`flex-1 py-3 rounded-xl transition-all font-bold text-sm ${
                material === m ? 'bg-white dark:bg-gray-700 shadow-md text-amber-600' : 'text-gray-400'
              }`}
            >
              {m === 'copper' ? 'Медь' : 'Алюминий'}
            </button>
          ))}
        </div>

        <div className="bg-amber-500 p-6 rounded-3xl text-white shadow-lg shadow-amber-200 dark:shadow-none">
          {calculation ? (
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black uppercase opacity-80 mb-2">Расчетный ток: {calculation.current} А</p>
              <div className="flex justify-around w-full">
                <div className="text-center">
                  <p className="text-[10px] uppercase opacity-70">Сечение</p>
                  <p className="text-3xl font-black">{calculation.s} <span className="text-sm font-medium">мм²</span></p>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-[10px] uppercase opacity-70">Автомат</p>
                  <p className="text-3xl font-black">{calculation.cb} <span className="text-sm font-medium">А</span></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 opacity-80">
              <p className="text-sm font-bold italic">Ожидание данных...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Модуль 3: Калькулятор для LED ленты ---
const LedWireCalculator = ({ defaults }) => {
  const [stripPower, setStripPower] = useState(defaults.stripPower);
  const [stripLength, setStripLength] = useState(defaults.stripLength);
  const [voltage, setVoltage] = useState(defaults.voltage);
  const [cableLength, setCableLength] = useState(defaults.cableLength);

  const calculation = useMemo(() => {
    const P_wm = parseFloat(stripPower) || 0;
    const L_s = parseFloat(stripLength) || 0;
    const L_c = parseFloat(cableLength) || 0;
    const V = parseInt(voltage);
    const P_total = P_wm * L_s;
    const I = P_total / V;
    
    const rho = 0.0175; // Удельное сопротивление меди

    // Расчет для 5%
    const deltaU5 = V * 0.05;
    const exactS5 = (2 * L_c * I * rho) / deltaU5;

    // Расчет для 7%
    const deltaU7 = V * 0.07;
    const exactS7 = (2 * L_c * I * rho) / deltaU7;

    const standardSections = [0.5, 0.75, 1.0, 1.5, 2.5, 4.0, 6.0, 10.0];
    const recommended = standardSections.find(s => s >= exactS5) || "> 10.0";

    return { P_total, I, exactS5, exactS7, recommended };
  }, [stripPower, stripLength, voltage, cableLength]);

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl shrink-0">
          <Sun size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">LED Линия</h2>
          <p className="text-xs text-gray-500">Потери в низковольтной цепи</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Вт/метр</label>
            <input type="number" inputMode="decimal" value={stripPower} onChange={e => setStripPower(e.target.value)} className="w-full px-4 py-3 rounded-2xl border dark:border-gray-700 dark:bg-gray-900 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Длина (м)</label>
            <input type="number" inputMode="decimal" value={stripLength} onChange={e => setStripLength(e.target.value)} className="w-full px-4 py-3 rounded-2xl border dark:border-gray-700 dark:bg-gray-900 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Вольтаж</label>
            <select value={voltage} onChange={e => setVoltage(e.target.value)} className="w-full px-4 py-3 rounded-2xl border dark:border-gray-700 dark:bg-gray-900 outline-none">
              <option value="12">12 В</option>
              <option value="24">24 В</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-pink-500 mb-1 ml-1">До ленты (м)</label>
            <input type="number" inputMode="decimal" value={cableLength} onChange={e => setCableLength(e.target.value)} className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 dark:border-pink-900 dark:bg-gray-900 outline-none font-bold" />
          </div>
        </div>

        {/* Главный результат (Рекомендуемый стандарт) */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-6 rounded-3xl text-white shadow-lg shadow-pink-200 dark:shadow-none text-center">
          <p className="text-[10px] uppercase font-bold opacity-80 mb-1 tracking-widest">Стандартный кабель:</p>
          <div className="text-4xl font-black flex items-center justify-center gap-1">
            {calculation.recommended} <span className="text-lg font-normal">мм²</span>
          </div>
        </div>

        {/* Детальные расчеты */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Точно (5% пот.)</p>
            <p className="text-lg font-black text-gray-700 dark:text-gray-300">
              {calculation.exactS5.toFixed(3)} <span className="text-[10px] font-normal">мм²</span>
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Точно (7% пот.)</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {calculation.exactS7.toFixed(3)} <span className="text-[10px] font-normal">мм²</span>
            </p>
          </div>
        </div>

        <div className="px-2 pt-1">
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mb-1">
            <span>Общий ток: {calculation.I.toFixed(2)} А</span>
            <span>Нагрузка: {calculation.P_total.toFixed(1)} Вт</span>
          </div>
          <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-pink-500" style={{ width: `${Math.min((calculation.exactS5/calculation.recommended)*100, 100)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Модуль 4: Генератор маркировки ---
const LabelGenerator = ({ defaults }) => {
  const [inputText, setInputText] = useState(defaults.text);
  const [labelWidth, setLabelWidth] = useState(defaults.width);
  const labels = useMemo(() => inputText.split('\n').filter(line => line.trim() !== ''), [inputText]);

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
          <Printer size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">Маркировка</h2>
          <p className="text-xs text-gray-500">Наклейки на пластрон</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          className="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          placeholder="Список групп через Enter..."
        />
        <div className="flex gap-2">
          {[1, 2].map(num => (
            <button
              key={num}
              onClick={() => setLabelWidth(num)}
              className={`flex-1 py-3 rounded-2xl border transition-all text-sm font-bold ${
                labelWidth === num ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'border-gray-100 dark:border-gray-700 text-gray-400'
              }`}
            >
              {num} {num === 1 ? 'модуль' : 'модуля'}
            </button>
          ))}
        </div>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex flex-wrap gap-1.5 min-w-max p-1">
            {labels.map((text, i) => (
              <div 
                key={i}
                style={{ width: `${labelWidth * 60}px` }}
                className="h-16 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center text-center p-1 shadow-sm"
              >
                <Zap size={12} className="text-amber-500 mb-1" />
                <span className="text-[10px] font-black uppercase leading-tight dark:text-gray-200 line-clamp-2">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Модуль Настроек ---
const SettingsView = ({ currentDefaults, onSave }) => {
  const [localDefaults, setLocalDefaults] = useState(currentDefaults);

  const handleSave = () => {
    onSave(localDefaults);
  };

  const updateSub = (tool, field, value) => {
    setLocalDefaults(prev => ({
      ...prev,
      [tool]: { ...prev[tool], [field]: value }
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-black uppercase text-blue-500 mb-4 flex items-center gap-2">
          <Layers size={16} /> DIN-рейка (По умолчанию)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ширина (мм)</label>
            <input 
              type="number" 
              value={localDefaults.din.widthMm} 
              onChange={e => updateSub('din', 'widthMm', e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Кол-во</label>
            <input 
              type="number" 
              value={localDefaults.din.quantity} 
              onChange={e => updateSub('din', 'quantity', e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-black uppercase text-amber-500 mb-4 flex items-center gap-2">
          <Zap size={16} /> Сечение кабеля
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Напряжение</label>
            <select 
              value={localDefaults.wire.voltage} 
              onChange={e => updateSub('wire', 'voltage', e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none text-sm"
            >
              <option value="230">230 В</option>
              <option value="400">400 В</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-black uppercase text-pink-500 mb-4 flex items-center gap-2">
          <Sun size={16} /> LED Лента
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Вт/м</label>
            <input 
              type="number" 
              value={localDefaults.led.stripPower} 
              onChange={e => updateSub('led', 'stripPower', e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Напряжение</label>
            <select 
              value={localDefaults.led.voltage} 
              onChange={e => updateSub('led', 'voltage', e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none text-sm"
            >
              <option value="12">12 В</option>
              <option value="24">24 В</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full py-5 bg-indigo-600 text-white rounded-[28px] font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Save size={20} /> Сохранить изменения
      </button>
    </div>
  );
};

// --- Модуль: Инструкция по установке (PWA Guide) ---
const PwaGuide = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
      <div className="w-16 h-16 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
        <Smartphone size={32} />
      </div>
      <h3 className="text-2xl font-black text-center mb-2">Установите как приложение!</h3>
      <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
        Чтобы пользоваться инструментом без браузерной строки и иметь быстрый доступ с рабочего стола:
      </p>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">1</div>
          <p className="text-sm">Нажмите кнопку <b>«Поделиться»</b> (в Safari) или <b>«Три точки»</b> (в Chrome)</p>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">2</div>
          <p className="text-sm">Выберите пункт <b>«На экран Домой»</b> или <b>«Установить приложение»</b></p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
      >
        Понятно
      </button>
    </div>
  </div>
);

// --- Главное Приложение ---
export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Глобальные настройки по умолчанию
  const [defaults, setDefaults] = useState({
    din: { widthMm: '17.5', quantity: 1 },
    wire: { power: '', voltage: '230', material: 'copper' },
    led: { stripPower: '14.4', stripLength: '5', voltage: '12', cableLength: '3' },
    labels: { text: "Ввод\nРозетки Кухня\nСвет Зал\nСтиралка\nКондиц", width: 1 }
  });

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(checkStandalone);
  }, []);

  const saveDefaults = (newDefaults) => {
    setDefaults(newDefaults);
    setActiveModule('dashboard');
  };

  const modules = [
    { id: 'din-calc', title: 'DIN-рейка', icon: <Layers size={22} />, component: <DinRailCalculator defaults={defaults.din} />, color: 'bg-blue-500', desc: 'Место в щите' },
    { id: 'wire-calc', title: 'Сечение', icon: <Zap size={22} />, component: <WireCalculator defaults={defaults.wire} />, color: 'bg-amber-500', desc: 'Расчет ПУЭ' },
    { id: 'led-calc', title: 'LED лента', icon: <Sun size={22} />, component: <LedWireCalculator defaults={defaults.led} />, color: 'bg-pink-500', desc: 'Потери 12/24В' },
    { id: 'label-gen', title: 'Маркировка', icon: <Printer size={22} />, component: <LabelGenerator defaults={defaults.labels} />, color: 'bg-emerald-500', desc: 'Для пластрона' }
  ];

  const currentModule = modules.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans pb-24 md:pb-0">
      {showPwaGuide && <PwaGuide onClose={() => setShowPwaGuide(false)} />}
      
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-8 flex-col shrink-0">
          <div className="flex items-center gap-4 mb-12 px-2 cursor-pointer" onClick={() => setActiveModule('dashboard')}>
            <div className="w-12 h-12 bg-indigo-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Calculator size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">Electro Pro</h1>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toolkit v2.7</span>
            </div>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeModule === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
            >
              <Home size={22} />
              <span>Главная</span>
            </button>
            <div className="pt-6 pb-2 px-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Инструментарий</div>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold ${activeModule === m.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <div className={`${activeModule === m.id ? 'text-indigo-600' : 'text-gray-300'}`}>{m.icon}</div>
                <span>{m.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-5 md:p-12 max-w-4xl mx-auto w-full">
          <header className="flex justify-between items-center mb-8 mt-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                {activeModule === 'dashboard' ? 'Привет!' : (activeModule === 'settings' ? 'Настройки' : currentModule?.title)}
              </h2>
              <p className="text-gray-400 font-medium">
                {activeModule === 'dashboard' ? 'Что сегодня рассчитываем?' : (activeModule === 'settings' ? 'Параметры по умолчанию' : currentModule?.desc)}
              </p>
            </div>
            <div className="flex gap-2">
              {!isStandalone && activeModule === 'dashboard' && (
                <button 
                  onClick={() => setShowPwaGuide(true)}
                  className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <Download size={20} />
                </button>
              )}
              <button 
                onClick={() => setActiveModule('settings')}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-all ${activeModule === 'settings' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'}`}
              >
                <Settings size={20} />
              </button>
            </div>
          </header>

          {activeModule === 'dashboard' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center gap-5 group"
                >
                  <div className={`w-16 h-16 ${m.color} text-white rounded-[22px] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                    {m.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-lg text-gray-800 dark:text-white leading-tight">{m.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">{m.desc}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-200 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              {activeModule === 'settings' ? (
                <SettingsView currentDefaults={defaults} onSave={saveDefaults} />
              ) : (
                currentModule?.component
              )}
              <button 
                onClick={() => setActiveModule('dashboard')}
                className="mt-8 w-full py-5 text-sm font-black text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[28px] hover:bg-white dark:hover:bg-gray-900 transition-all active:scale-95"
              >
                Вернуться на главную
              </button>
            </div>
          )}
        </main>

        {/* Mobile Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 flex justify-around items-center px-4 pt-3 pb-8 z-50 rounded-t-[32px] shadow-2xl">
          <button 
            onClick={() => setActiveModule('dashboard')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeModule === 'dashboard' ? 'text-indigo-600' : 'text-gray-300'}`}
          >
            <Home size={24} className={activeModule === 'dashboard' ? 'scale-110' : ''} />
            <span className="text-[9px] font-black uppercase tracking-wider">Меню</span>
          </button>
          {modules.map((m) => (
            <button 
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeModule === m.id ? 'text-indigo-600' : 'text-gray-300'}`}
            >
              <div className={activeModule === m.id ? 'scale-110' : ''}>{m.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-wider">{m.title.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}