import React from 'react';

export const inputCls = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white';
export const btnPrimario = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-lg hover:bg-green-900 disabled:opacity-50 transition-colors';
export const btnSecundario = 'inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors';
export const btnPerigo = 'inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors';

export function Campo({ label, dica, children }) {
  return (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      {children}
      {dica && <span className="block mt-1 text-xs text-gray-500">{dica}</span>}
    </label>
  );
}

export function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl my-8 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-green-900">{titulo}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-2xl leading-none text-gray-400 hover:text-gray-700">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Vazio({ children }) {
  return <div className="p-10 text-center text-gray-500 bg-white border border-gray-200 border-dashed rounded-xl">{children}</div>;
}

export function mensagemErro(e, padrao = 'Não foi possível concluir. Tente novamente.') {
  if (e?.response?.status === 403) return 'Seu usuário não tem permissão para esta ação.';
  return e?.response?.data?.mensagem || padrao;
}
