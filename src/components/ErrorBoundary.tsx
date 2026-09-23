import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage', e);
    }
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0a1228] border border-amber-400/50 rounded-2xl p-6 shadow-2xl text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h1 className="text-xl font-bold text-amber-300 font-serif mb-2">
              ĐÃ CÓ LỖI XẢY RA KHI TẢI GIAO DIỆN
            </h1>
            <p className="text-xs text-slate-300 mb-4">
              {this.state.error?.message || 'Không thể hiển thị giao diện do dữ liệu lưu tạm gặp sự cố.'}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                🔄 Tải Lại Trang
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                🧹 Xóa Dữ Liệu Lưu Tạm & Khởi Động Lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
