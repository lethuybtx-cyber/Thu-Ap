import React, { useState } from 'react';
import { Table, Copy, Check, ExternalLink, Send, AlertCircle, Sparkles } from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetUrl: string;
  onSaveSheetUrl: (url: string) => void;
}

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * HỆ THỐNG KẾT NỐI DỮ LIỆU THI - AI LÀ TRIỆU PHÚ TOÁN HỌC (LÊ THỦY)
 * Tự động đồng bộ kết quả thi của học sinh vào Google Sheet
 * ====================================================================
 */

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Hệ thống kết nối Google Sheet AI LÀ TRIỆU PHÚ TOÁN HỌC đang hoạt động tốt!"
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // Khóa đồng bộ khi nhiều học sinh nộp bài cùng lúc

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Đọc dữ liệu gửi từ ứng dụng
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Nếu trang tính chưa có tiêu đề cột, tự động tạo hàng tiêu đề chuẩn đẹp
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Thời gian nộp",
        "Họ và tên",
        "Lớp",
        "Tên đề thi",
        "Điểm tổng (/10)",
        "Điểm Phần I (/3.0đ)",
        "Điểm Phần II (/4.0đ)",
        "Điểm Phần III (/3.0đ)",
        "Số câu đúng P1",
        "Số câu đúng P2",
        "Số câu đúng P3",
        "Thời gian làm bài",
        "Số lần vi phạm",
        "Ghi chú"
      ];
      
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e3a8a"); // Màu xanh dương sang trọng
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Thời gian nộp bài theo múi giờ Việt Nam
    var nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    // Định dạng thời gian làm bài (phút : giây)
    var timeSpentStr = "";
    if (data.timeSpentSeconds !== undefined) {
      var mins = Math.floor(Number(data.timeSpentSeconds) / 60);
      var secs = Number(data.timeSpentSeconds) % 60;
      timeSpentStr = mins + " phút " + secs + " giây";
    } else if (data.timeSpent) {
      timeSpentStr = data.timeSpent;
    }

    // Tạo hàng dữ liệu mới
    var newRow = [
      data.timestamp || nowStr,
      data.playerName || data.name || "Thí sinh",
      data.className || data.lop || "",
      data.examTitle || data.title || "Đề thi Toán",
      data.score !== undefined ? Number(data.score) : 0,
      data.partIScore !== undefined ? Number(data.partIScore) : "",
      data.partIIScore !== undefined ? Number(data.partIIScore) : "",
      data.partIIIScore !== undefined ? Number(data.partIIIScore) : "",
      data.totalCorrectPartI !== undefined ? data.totalCorrectPartI + "/12" : "",
      data.totalCorrectPartII !== undefined ? data.totalCorrectPartII + "/4" : "",
      data.totalCorrectPartIII !== undefined ? data.totalCorrectPartIII + "/6" : "",
      timeSpentStr,
      data.violationCount !== undefined ? Number(data.violationCount) : 0,
      data.note || (Number(data.violationCount) > 0 ? "⚠️ Có " + data.violationCount + " lần rời tab" : "✅ Trung thực")
    ];

    sheet.appendRow(newRow);

    // Căn giữa các cột thông tin
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 3, 1, sheet.getLastColumn() - 2).setHorizontalAlignment("center");

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Đã lưu kết quả bài thi vào Google Sheet thành công!",
        row: lastRow
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}`;

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  sheetUrl,
  onSaveSheetUrl,
}) => {
  const [urlInput, setUrlInput] = useState(sheetUrl || '');
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback copy
      const textArea = document.createElement('textarea');
      textArea.value = GOOGLE_APPS_SCRIPT_CODE;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = () => {
    onSaveSheetUrl(urlInput.trim());
    setTestResult({ success: true, message: 'Đã lưu đường dẫn Google Sheet thành công!' });
  };

  const handleTestConnection = async () => {
    const targetUrl = urlInput.trim();
    if (!targetUrl) {
      setTestResult({ success: false, message: 'Vui lòng dán URL Web App của Google Apps Script trước khi kiểm tra.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const testPayload = {
      timestamp: new Date().toLocaleString('vi-VN'),
      playerName: 'Thí sinh Thử Nghiệm',
      className: '12A1',
      examTitle: 'Đề 1 (Kiểm tra kết nối)',
      score: 9.6,
      partIScore: 3.0,
      partIIScore: 3.6,
      partIIIScore: 3.0,
      totalCorrectPartI: 12,
      totalCorrectPartII: 4,
      totalCorrectPartIII: 6,
      timeSpentSeconds: 2450,
      violationCount: 0,
      note: 'Dữ liệu kiểm tra kết nối từ hệ thống',
    };

    try {
      // Try sending via backend proxy first
      const res = await fetch('/api/submit-to-google-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleSheetUrl: targetUrl,
          payload: testPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult({
          success: true,
          message: data.message || 'Kết nối thành công! Đã gửi 1 dòng dữ liệu mẫu lên Google Sheet của bạn.',
        });
        onSaveSheetUrl(targetUrl);
      } else {
        // Fallback to direct client-side fetch with no-cors
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(testPayload),
        });
        setTestResult({
          success: true,
          message: 'Đã gửi dữ liệu mẫu lên Google Sheet! Hãy kiểm tra file Trang tính của bạn.',
        });
        onSaveSheetUrl(targetUrl);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Không thể kết nối tới Google Apps Script. Vui lòng kiểm tra quyền truy cập "Bất kỳ ai (Anyone)" khi triển khai.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#08122c] border-2 border-emerald-400/80 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e345e] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400">
              <Table size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-300 font-serif uppercase tracking-wider flex items-center gap-2">
                <span>KẾT NỐI DỮ LIỆU LÊN GOOGLE SHEET</span>
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Tự động lưu điểm số, thời gian làm bài và danh sách học sinh vào Trang tính
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 3 Steps Guide */}
        <div className="bg-[#040a1c] border border-emerald-500/30 rounded-xl p-3 sm:p-4 space-y-3 text-xs text-slate-200">
          <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>3 BƯỚC ĐỂ KẾT NỐI NHANH:</span>
          </div>

          <ol className="list-decimal list-inside space-y-2 leading-relaxed">
            <li>
              Mở <strong>Google Sheet</strong> của bạn $\rightarrow$ vào menu <strong>Tiện ích mở rộng (Extensions)</strong> $\rightarrow$ chọn <strong>Apps Script</strong>.
            </li>
            <li>
              Xóa hết nội dung trong tệp <code>Mã.gs</code> (như trong ảnh bạn chụp) và <strong>dán toàn bộ đoạn mã</strong> bên dưới vào.
            </li>
            <li>
              Nhấn <strong>Triển khai (Deploy)</strong> $\rightarrow$ <strong>Tùy chọn triển khai mới (New deployment)</strong> $\rightarrow$ Chọn loại <strong>Ứng dụng web (Web app)</strong>:
              <ul className="list-disc list-inside ml-4 mt-1 text-amber-300 space-y-0.5">
                <li>Thực thi dưới dạng: <strong>Tôi (My account)</strong></li>
                <li>Người có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong> *(Quan trọng để app gửi được)*</li>
              </ul>
              Sau đó sao chép <strong>URL ứng dụng web</strong> và dán vào ô bên dưới.
            </li>
          </ol>
        </div>

        {/* Code Box with 1-click Copy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>MÃ NGUỒN APPS SCRIPT (DÁN VÀO MÃ.GS):</span>
            </label>
            <button
              onClick={handleCopyCode}
              className={`py-1 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'ĐÃ SAO CHÉP TOÀN BỘ MÃ!' : 'SAO CHÉP MÃ APPS SCRIPT'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-3 bg-[#030712] border border-[#1e345e] rounded-xl text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-48 scrollbar-thin select-all">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>
        </div>

        {/* Webhook URL Input */}
        <div className="space-y-2 pt-2 border-t border-[#1e345e]">
          <label className="block text-xs font-bold text-amber-300">
            DÁN URL ỨNG DỤNG WEB (GOOGLE APPS SCRIPT WEB APP URL):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 px-3 py-2 rounded-lg bg-[#040a1c] border border-[#1e345e] text-slate-100 text-xs focus:outline-none focus:border-emerald-400 placeholder:text-slate-500 font-mono"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
              >
                Lưu URL
              </button>
              <button
                type="button"
                disabled={isTesting}
                onClick={handleTestConnection}
                className="py-2 px-3 rounded-lg text-xs font-extrabold bg-gradient-to-b from-emerald-500 to-teal-600 text-white hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow disabled:opacity-60"
              >
                <Send size={13} className={isTesting ? 'animate-spin' : ''} />
                <span>{isTesting ? 'Đang gửi thử...' : 'GỬI THỬ LÊN SHEET'}</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in ${
                testResult.success
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-500/60 text-rose-300'
              }`}
            >
              {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="text-[11px] text-slate-400 italic pt-1 flex items-center justify-between border-t border-[#1e345e]">
          <span>💡 Khi học sinh nộp bài, kết quả sẽ tự động được gửi và điền vào bảng Google Sheet.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
