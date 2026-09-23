const fs = require('fs');
let content = fs.readFileSync('src/components/WordImportModal.tsx', 'utf8');

// The messed up lines:
const regex = /<li><strong>Phần I \(Trắc nghiệm\):<\/strong>.*?<li><strong>Hình vẽ:<\/strong> Để dưới dạng <code>in line with text<\/code><\/li>/g;

content = content.replace(regex, `<li><strong>Phần I (Trắc nghiệm):</strong> 4 phương án bắt đầu bằng <code>A.</code>, <code>B.</code>, <code>C.</code>, <code>D.</code> Dòng đáp án: chỉ cần gạch chân 1 trong 4 lựa chọn A,B,C,D</li>
                  <li><strong>Phần II (Đúng / Sai):</strong> 4 mệnh đề <code>a)</code>, <code>b)</code>, <code>c)</code>, <code>d)</code> chỉ cần gạch chân đáp án đúng</li>
                  <li><strong>Phần III (Trả lời ngắn):</strong> Ghi rõ dòng <code>Đáp số: [giá trị]</code></li>
                  <li><strong>Hướng dẫn giải (Tùy chọn):</strong> Thêm dòng <code>Lời giải: [nội dung]</code> ở cuối câu</li>
                  <li><strong>Công thức Toán học:</strong> Nhập công thức Toán học dưới dạng mã LaTeX, kẹp giữa dấu <code>$</code> (Ví dụ: <code>$x^2 + 1 = 0$</code>) để hệ thống tự động nhận diện và hiển thị. Không sử dụng Equation của Word vì sẽ không được nhận diện.</li>
                  <li><strong>Hình vẽ:</strong> Để dưới dạng <code>in line with text</code></li>`);

fs.writeFileSync('src/components/WordImportModal.tsx', content);
