import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, LogOut, Check, AlertCircle, Table } from 'lucide-react';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOwnerAuthenticated: boolean;
  onAuthenticate: (pin: string) => boolean;
  onChangePin: (oldPin: string, newPin: string) => boolean;
  onLogout: () => void;
  onOpenGoogleSheet?: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  isOwnerAuthenticated,
  onAuthenticate,
  onChangePin,
  onLogout,
  onOpenGoogleSheet,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!pinInput.trim()) {
      setErrorMessage('Vui lòng nhập mã PIN / Mật mã');
      return;
    }

    const success = onAuthenticate(pinInput.trim());
    if (success) {
      setPinInput('');
      setSuccessMessage('Xác thực chủ tài khoản thành công!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 700);
    } else {
      setErrorMessage('Mật mã không đúng! Vui lòng thử lại.');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!oldPinInput.trim() || !newPinInput.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPinInput.length < 4) {
      setErrorMessage('Mật mã mới phải có ít nhất 4 ký tự');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setErrorMessage('Xác nhận mật mã mới không khớp');
      return;
    }

    const success = onChangePin(oldPinInput.trim(), newPinInput.trim());
    if (success) {
      setSuccessMessage('Đổi mật mã thành công!');
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setIsChangingPin(false);
    } else {
      setErrorMessage('Mật mã cũ không chính xác!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#08122c] border-2 border-amber-400/80 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e345e] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[#facc15]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#facc15] font-serif uppercase tracking-wider">
                XÁC THỰC CHỦ TÀI KHOẢN
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Dành riêng cho Giáo viên / Quản trị viên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status indicator */}
        {isOwnerAuthenticated ? (
          <div className="flex flex-col gap-3">
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0">
                👑
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-emerald-300">
                  Đang đăng nhập quyền Chủ Tài Khoản
                </p>
                <p className="text-[11px] text-slate-300">
                  Bạn có toàn quyền truy cập mục Tạo Đề & Chế Độ Giáo Viên.
                </p>
              </div>
            </div>

            {successMessage && (
              <div className="p-2.5 bg-emerald-900/50 border border-emerald-400/60 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/60 rounded-lg text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Change PIN toggle */}
            {!isChangingPin ? (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => setIsChangingPin(true)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-[#0f244a] hover:bg-[#183566] text-amber-300 border border-[#1e3a6e] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound size={15} />
                  <span>Đổi mã PIN / Mật mã Chủ tài khoản</span>
                </button>

                {onOpenGoogleSheet && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenGoogleSheet();
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Table size={15} />
                    <span>Cài đặt kết nối Google Sheet (Apps Script)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-500/40 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Đăng xuất quyền Chủ tài khoản (Khóa)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePinSubmit} className="flex flex-col gap-2.5 pt-1">
                <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>Đổi Mật Mã Chủ Tài Khoản</span>
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(false)}
                    className="text-slate-400 hover:text-white underline text-[11px]"
                  >
                    Hủy
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Mật mã hiện tại:
                  </label>
                  <input
                    type="password"
                    value={oldPinInput}
                    onChange={(e) => setOldPinInput(e.target.value)}
                    placeholder="Nhập mật mã cũ..."
                    className="w-full px-3 py-2 rounded-lg bg-[#040a1c] border border-[#1e345e] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Mật mã mới:
                  </label>
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Nhập mật mã mới..."
                    className="w-full px-3 py-2 rounded-lg bg-[#040a1c] border border-[#1e345e] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    Xác nhận mật mã mới:
                  </label>
                  <input
                    type="password"
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="Nhập lại mật mã mới..."
                    className="w-full px-3 py-2 rounded-lg bg-[#040a1c] border border-[#1e345e] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-1 py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-b from-[#fde047] to-[#eab308] text-[#0f172a] shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  Lưu Mật Mã Mới
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
            <div className="bg-[#040a1c] p-3 rounded-xl border border-[#1e345e] space-y-1">
              <p className="text-xs text-slate-200 leading-relaxed">
                Mục <strong className="text-amber-300">Tạo Đề</strong> và <strong className="text-amber-300">Chế Độ Giáo Viên</strong> được bảo vệ. Vui lòng nhập mã xác thực để mở khóa.
              </p>
              <p className="text-[11px] text-amber-400/90 italic">
                (Mật mã mặc định ban đầu: <strong className="font-mono">2027</strong>)
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/60 rounded-lg text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in shake">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 bg-emerald-900/50 border border-emerald-400/60 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-amber-400" />
                <span>Nhập mã PIN / Mật mã Chủ tài khoản:</span>
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ví dụ: 2027"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040a1c] border-2 border-amber-400/70 text-amber-300 text-center font-mono font-bold text-base focus:outline-none focus:border-amber-400 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 border border-[#1e345e] transition cursor-pointer"
              >
                HỦY BỎ
              </button>

              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#eab308] text-[#0f172a] shadow hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound size={15} />
                <span>XÁC THỰC</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
