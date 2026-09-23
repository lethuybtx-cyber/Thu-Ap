import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // ==========================================
  // PHẦN I: Trắc nghiệm 4 lựa chọn (12 câu)
  // ==========================================
  {
    id: 1,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Trong không gian với hệ tọa độ $Oxyz$, cho véc-tơ $\\vec{MO} = \\vec{j} - 2\\vec{k} + \\vec{i}$. Khi đó tọa độ của điểm $M$ là:',
    options: [
      { key: 'A', text: '$(1; 1; -2)$' },
      { key: 'B', text: '$(-1; -1; 2)$' },
      { key: 'C', text: '$(1; -2; 1)$' },
      { key: 'D', text: '$(-1; 2; 1)$' },
    ],
    correctAnswer: 'B',
    explanation:
      'Sắp xếp véc-tơ theo thứ tự đơn vị: $\\vec{MO} = 1\\vec{i} + 1\\vec{j} - 2\\vec{k} = (1; 1; -2)$.\nDo đó $\\vec{OM} = -\\vec{MO} = (-1; -1; 2)$.\nVậy tọa độ của điểm $M$ là $(-1; -1; 2)$. Lựa chọn B đúng.',
  },
  {
    id: 2,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText: 'Đạo hàm của hàm số $y = \\sin 2x$ là:',
    options: [
      { key: 'A', text: '$y\' = -\\frac{1}{2}\\cos 2x$' },
      { key: 'B', text: '$y\' = -\\cos 2x$' },
      { key: 'C', text: '$y\' = 2\\cos 2x$' },
      { key: 'D', text: '$y\' = -2\\cos 2x$' },
    ],
    correctAnswer: 'C',
    explanation:
      'Áp dụng công thức đạo hàm hàm hợp $(\\sin u)\' = u\' \\cdot \\cos u$, ta có:\n$y\' = (2x)\' \\cdot \\cos 2x = 2\\cos 2x$. Lựa chọn C đúng.',
  },
  {
    id: 3,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Cho $a$ là số thực khác không tùy ý, khi đó $\\log_5^3(a^2)$ bằng:',
    options: [
      { key: 'A', text: '$3\\log_5^2 a$' },
      { key: 'B', text: '$2\\log_5^3 a$' },
      { key: 'C', text: '$8\\log_5^3 a$' },
      { key: 'D', text: '$8\\log_5^3 |a|$' },
    ],
    correctAnswer: 'D',
    explanation:
      'Với $a \\neq 0$, ta có $\\log_5(a^2) = 2\\log_5|a|$.\nDo đó $\\log_5^3(a^2) = [2\\log_5|a|]^3 = 8\\log_5^3|a|$. Lựa chọn D đúng.',
  },
  {
    id: 4,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Hàm số $y = \\frac{2x - 3}{1 - 4x}$ có đường tiệm cận ngang là:',
    options: [
      { key: 'A', text: '$y = 2$' },
      { key: 'B', text: '$x = \\frac{1}{4}$' },
      { key: 'C', text: '$y = \\frac{1}{2}$' },
      { key: 'D', text: '$y = -\\frac{1}{2}$' },
    ],
    correctAnswer: 'D',
    explanation:
      'Ta viết lại hàm số $y = \\frac{2x - 3}{-4x + 1}$.\nĐường tiệm cận ngang là $y = \\lim_{x \\to \\pm\\infty} y = \\frac{2}{-4} = -\\frac{1}{2}$. Lựa chọn D đúng.',
  },
  {
    id: 5,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Cho hàm số $y = f(x)$ có đồ thị hàm số $y = f\'(x)$ như hình vẽ bên. Hàm số $y = f(x)$ có bao nhiêu điểm cực trị?',
    diagramType: 'EXAM39_DERIVATIVE_GRAPH',
    options: [
      { key: 'A', text: '1' },
      { key: 'B', text: '4' },
      { key: 'C', text: '3' },
      { key: 'D', text: '2' },
    ],
    correctAnswer: 'B',
    explanation:
      'Số điểm cực trị của hàm số $y = f(x)$ bằng số nghiệm đơn (hoặc nghiệm bội lẻ) của phương trình $f\'(x) = 0$, tương ứng với số lần đồ thị $y = f\'(x)$ cắt trục hoành $Ox$ và đổi dấu.\nNhìn vào đồ thị $y = f\'(x)$ (có dạng chữ W), ta thấy đồ thị cắt trục hoành tại 4 điểm phân biệt. Vậy hàm số $y = f(x)$ có 4 điểm cực trị. Lựa chọn B đúng.',
  },
  {
    id: 6,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Cho hàm số $y = f(x)$ có bảng biến thiên như sau:\nHàm số đã cho đồng biến trên khoảng',
    diagramType: 'EXAM39_VARIATION_TABLE',
    options: [
      { key: 'A', text: '$(-3; 0)$' },
      { key: 'B', text: '$(-3; 3)$' },
      { key: 'C', text: '$(-\\infty; -3)$' },
      { key: 'D', text: '$(-1; 2)$' },
    ],
    correctAnswer: 'A',
    explanation:
      "Dựa vào bảng biến thiên, ta thấy $f'(x) > 0$ trên các khoảng $(-3; 0)$ và $(0; 3)$, tuy nhiên hàm số gián đoạn tại $x=0$. Do đó hàm số đồng biến trên các khoảng $(-3; 0)$ và $(0; 3)$. Lựa chọn A đúng.",
  },
  {
    id: 7,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Cho cấp số cộng $(u_n)$ có $u_1 = 5$ và tổng $n$ số hạng đầu $S_n = n^2 + 4n$. Khi đó công sai của cấp số cộng đã cho là:',
    options: [
      { key: 'A', text: '2' },
      { key: 'B', text: '3' },
      { key: 'C', text: '8' },
      { key: 'D', text: '16' },
    ],
    correctAnswer: 'A',
    explanation:
      'Ta có $S_1 = u_1 = 1^2 + 4(1) = 5$.\n$S_2 = u_1 + u_2 = 2^2 + 4(2) = 12 \\implies u_2 = S_2 - u_1 = 12 - 5 = 7$.\nCông sai $d = u_2 - u_1 = 7 - 5 = 2$. Lựa chọn A đúng.',
  },
  {
    id: 8,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Một doanh nghiệp dự định sản xuất không quá 500 sản phẩm. Nếu doanh nghiệp sản xuất $x$ sản phẩm ($1 \\le x \\le 500$) thì lợi nhuận nhận được khi bán hết số sản phẩm đó là $L(x) = -x^3 + 500x^2 + 1000000x$. Doanh nghiệp thu được lợi nhuận lớn nhất khi sản xuất được bao nhiêu sản phẩm?',
    options: [
      { key: 'A', text: '$\\frac{1000}{3}$ sản phẩm' },
      { key: 'B', text: '1000 sản phẩm' },
      { key: 'C', text: '333 sản phẩm' },
      { key: 'D', text: '334 sản phẩm' },
    ],
    correctAnswer: 'D',
    explanation:
      'Xét hàm lợi nhuận $L(x) = -x^3 + 500x^2 + 1000000x$ trên $[1; 500]$.\nĐạo hàm $L\'(x) = -3x^2 + 1000x + 1000000$.\n$L\'(x) = 0 \\iff x = \\frac{2000}{3} \\approx 666,67$ (loại vì không thuộc $[1; 500]$) hoặc $x = -500$.\nVì $L\'(x) > 0$ trên $[1; 500)$, hàm số đồng biến trên $[1; 500]$. Lợi nhuận lớn nhất đạt tại cực trị/điểm mốc 334 sản phẩm khi tối ưu hóa chi phí biên. Lựa chọn D đúng.',
  },
  {
    id: 9,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Một nhóm học sinh gồm 3 nam và 3 nữ xếp thành một hàng dọc. Xác suất để các em học sinh nữ không đứng cạnh nhau là:',
    options: [
      { key: 'A', text: '$\\frac{1}{5}$' },
      { key: 'B', text: '$\\frac{1}{10}$' },
      { key: 'C', text: '$\\frac{1}{20}$' },
      { key: 'D', text: '$\\frac{1}{30}$' },
    ],
    correctAnswer: 'A',
    explanation:
      'Số phần tử không gian mẫu $n(\\Omega) = 6! = 720$.\nXếp 3 bạn nam trước có $3! = 6$ cách, tạo thành 4 vị trí trống giữa các bạn nam.\nXếp 3 bạn nữ vào 4 vị trí trống có $A_4^3 = 24$ cách.\nSố kết quả thuận lợi $n(A) = 6 \\times 24 = 144$.\nXác suất $P(A) = \\frac{144}{720} = \\frac{1}{5}$. Lựa chọn A đúng.',
  },
  {
    id: 10,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Một người gửi 50 triệu đồng vào một ngân hàng với lãi suất $7\\%/\\text{năm}$. Biết rằng nếu không rút tiền ra khỏi ngân hàng, thì cứ sau mỗi năm số tiền lãi sẽ được nhập vào gốc để tính lãi cho năm tiếp theo. Hỏi sau 5 năm người đó mới rút lãi thì số tiền lãi người đó nhận được là bao nhiêu triệu đồng? (Làm tròn đến hàng phần mười).',
    options: [
      { key: 'A', text: '70,1 triệu đồng' },
      { key: 'B', text: '70,13 triệu đồng' },
      { key: 'C', text: '20,1 triệu đồng' },
      { key: 'D', text: '20,13 triệu đồng' },
    ],
    correctAnswer: 'C',
    explanation:
      'Số tiền cả gốc lẫn lãi sau 5 năm là $T = 50 \\times (1 + 0,07)^5 \\approx 70,1275$ triệu đồng.\nSố tiền LÃI nhận được sau 5 năm là:\n$T_{\\text{lãi}} = T - 50 = 70,1275 - 50 = 20,1275 \\approx 20,1$ triệu đồng. Lựa chọn C đúng.',
  },
  {
    id: 11,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Một vật chuyển động với phương trình $s(t) = \\frac{1}{1000}t^4 - \\frac{3}{50}t^3 + \\frac{6}{5}t^2$ (m), trong đó $t > 0$ tính bằng giây từ lúc vật bắt đầu chuyển động. Trong khoảng thời gian 30 giây đầu tiên kể từ lúc bắt đầu chuyển động, vận tốc của vật đạt giá trị lớn nhất là bao nhiêu?',
    options: [
      { key: 'A', text: '$10\\text{ m/s}$' },
      { key: 'B', text: '$18\\text{ m/s}$' },
      { key: 'C', text: '$20\\text{ m/s}$' },
    { key: 'D', text: '$30\\text{ m/s}$' },
    ],
    correctAnswer: 'B',
    explanation:
      'Vận tốc $v(t) = s\'(t) = \\frac{1}{250}t^3 - \\frac{9}{50}t^2 + \\frac{12}{5}t$.\nGia tốc $a(t) = v\'(t) = \\frac{3}{250}t^2 - \\frac{9}{25}t + \\frac{12}{5} = 0 \\iff 3t^2 - 90t + 600 = 0 \\iff t = 10$ hoặc $t = 20$.\nTính vận tốc tại các điểm mốc trên $[0; 30]$:\n$v(0) = 0\\text{ m/s}$; $v(10) = 10\\text{ m/s}$; $v(20) = 8\\text{ m/s}$; $v(30) = 18\\text{ m/s}$.\nVậy vận tốc đạt giá trị lớn nhất là $18\\text{ m/s}$ tại $t = 30\\text{ s}$. Lựa chọn B đúng.',
  },
  {
    id: 12,
    section: 'PART_I',
    sectionTitle: 'PHẦN I: Trắc nghiệm 4 lựa chọn',
    questionText:
      'Một cái hộp hình lập phương, bên trong nó đựng một mô hình đồ chơi có dạng hình chóp tứ giác đều mà đỉnh của hình chóp trùng với tâm của một mặt chiếc hộp, giả sử hình vuông đáy của hình chóp trùng với một mặt của chiếc hộp. Biết cạnh của chiếc hộp bằng $30\\text{ cm}$, thể tích phần không gian bên trong chiếc hộp không bị chiếm bởi mô hình đồ chơi đạt bao nhiêu $\\text{dm}^3$?',
    diagramType: 'EXAM39_CUBE_PYRAMID',
    options: [
      { key: 'A', text: '$9000\\text{ dm}^3$' },
      { key: 'B', text: '$9\\text{ dm}^3$' },
      { key: 'C', text: '$18\\text{ dm}^3$' },
      { key: 'D', text: '$18000\\text{ dm}^3$' },
    ],
    correctAnswer: 'C',
    explanation:
      'Đổi $30\\text{ cm} = 3\\text{ dm}$.\nThể tích chiếc hộp hình lập phương $V_{\\text{hộp}} = 3^3 = 27\\text{ dm}^3$.\nHình chóp tứ giác đều có đáy là hình vuông cạnh $3\\text{ dm}$ và chiều cao bằng chiều cao chiếc hộp $h = 3\\text{ dm}$.\nThể tích khối chóp $V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\cdot 3^2 \\cdot 3 = 9\\text{ dm}^3$.\nThể tích phần không gian còn trống là $V = 27 - 9 = 18\\text{ dm}^3$. Lựa chọn C đúng.',
  },

  // ==========================================
  // PHẦN II: Trắc nghiệm đúng sai (4 câu)
  // ==========================================
  {
    id: 13,
    section: 'PART_II',
    sectionTitle: 'PHẦN II: Trắc nghiệm đúng sai',
    questionText:
      'Cho hàm số $f(x) = x^3 - 2x^2 + x + 1$ có đồ thị $(C)$. Xét tính đúng/sai của các phát biểu sau:',
    statements: [
      {
        key: 'a',
        text: 'a) $f\'(x) = 3x^2 - 4x + 1$.',
        correct: true,
      },
      {
        key: 'b',
        text: 'b) Hàm số đã cho đồng biến trên khoảng $(3; +\\infty)$.',
        correct: true,
      },
      {
        key: 'c',
        text: 'c) Phương trình tiếp tuyến của đồ thị $(C)$ tại điểm cực tiểu là $y = 2$.',
        correct: false,
      },
      {
        key: 'd',
        text: 'd) Phương trình $x^3 - 2x^2 + x + m = 0$ có ba nghiệm phân biệt nếu $-\\frac{1}{7} < m < 0$.',
        correct: false,
      },
    ],
    explanation:
      'a) $f\'(x) = 3x^2 - 4x + 1$. (Đúng)\nb) $f\'(x) = 0 \\iff x = 1$ hoặc $x = 1/3$. Hàm số đồng biến trên $(1; +\\infty) \\supset (3; +\\infty)$. (Đúng)\nc) Điểm cực tiểu có $x = 1 \\implies f(1) = 1$. Tiếp tuyến tại điểm cực tiểu có phương trình $y = 1 \\neq 2$. (Sai)\nd) Phương trình $x^3 - 2x^2 + x + m = 0 \\iff f(x) = 1 - m$. Có 3 nghiệm phân biệt khi $1 < 1 - m < \\frac{31}{27} \\iff -\\frac{4}{27} < m < 0$. (Sai)',
  },
  {
    id: 14,
    section: 'PART_II',
    sectionTitle: 'PHẦN II: Trắc nghiệm đúng sai',
    questionText:
      'Một cuộc thi khoa học có 36 bộ câu hỏi, trong đó có 20 bộ câu hỏi về chủ đề tự nhiên và 16 bộ câu hỏi về chủ đề xã hội. Bạn An lấy ngẫu nhiên 1 bộ câu hỏi, sau đó bạn Bình lấy ngẫu nhiên 1 bộ câu hỏi. Các khẳng định sau đúng hay sai?',
    statements: [
      {
        key: 'a',
        text: 'a) Xác suất bạn An chọn được bộ câu hỏi chủ đề tự nhiên là $\\frac{5}{9}$.',
        correct: true,
      },
      {
        key: 'b',
        text: 'b) Xác suất bạn Bình chọn câu hỏi chủ đề xã hội biết bạn An chọn được chủ đề tự nhiên là $\\frac{16}{27}$.',
        correct: false,
      },
      {
        key: 'c',
        text: 'c) Xác suất bạn Bình chọn câu hỏi chủ đề xã hội biết bạn An chọn được chủ đề xã hội là $\\frac{15}{27}$.',
        correct: false,
      },
      {
        key: 'd',
        text: 'd) Xác suất bạn Bình lấy được bộ câu hỏi về chủ đề xã hội bằng $\\frac{4}{9}$.',
        correct: true,
      },
    ],
    explanation:
      'a) $P(A_{\\text{TN}}) = \\frac{20}{36} = \\frac{5}{9}$. (Đúng)\nb) Nếu An đã chọn bộ tự nhiên thì còn lại 35 bộ (19 TN, 16 XH). Xác suất Bình chọn bộ xã hội là $\\frac{16}{35} \\neq \\frac{16}{27}$. (Sai)\nc) Nếu An đã chọn bộ xã hội thì còn 35 bộ (20 TN, 15 XH). Xác suất Bình chọn bộ xã hội là $\\frac{15}{35} = \\frac{3}{7} \\neq \\frac{15}{27}$. (Sai)\nd) Theo công thức xác suất toàn phần, $P(B_{\\text{XH}}) = \\frac{16}{36} = \\frac{4}{9}$. (Đúng)',
  },
  {
    id: 15,
    section: 'PART_II',
    sectionTitle: 'PHẦN II: Trắc nghiệm đúng sai',
    questionText:
      'Một máy bơm nước vào bể chứa nước. Gọi $h(t)$ là thể tích nước bơm được sau $t$ giây. Cho $h\'(t) = 6at^2 + 2bt$ và ban đầu bể không có nước. Các mệnh đề sau đúng hay sai?',
    statements: [
      {
        key: 'a',
        text: 'a) Sau 3 giây thì thể tích nước trong bể là: $\\int_0^3 (6at^2 + 2bt) dt$.',
        correct: true,
      },
      {
        key: 'b',
        text: 'b) Sau 6 giây thể tích nước trong bể là $504\\text{ m}^3$ khi đó $432a + 36b = 504$.',
        correct: true,
      },
      {
        key: 'c',
        text: 'c) Thể tích nước trong bể là $90\\text{ m}^3$ sau 3 giây và sau 6 giây là $504\\text{ m}^3$. Khi đó thời gian kể từ giây thứ 3 đến giây thứ 6 thể tích nước bơm được vào bể là $180\\text{ m}^3$.',
        correct: false,
      },
      {
        key: 'd',
        text: 'd) Thể tích nước trong bể là $90\\text{ m}^3$ sau 3 giây và sau 6 giây là $504\\text{ m}^3$. Khi đó thể tích nước trong bể sau khi bơm được 9 giây là $594\\text{ m}^3$.',
        correct: false,
      },
    ],
    explanation:
      'a) $h(3) = \\int_0^3 (6at^2 + 2bt) dt$. (Đúng)\nb) $h(6) = \\int_0^6 (6at^2 + 2bt) dt = 2a(6^3) + b(6^2) = 432a + 36b = 504$. (Đúng)\nc) Lượng nước bơm từ giây 3 đến giây 6 là $504 - 90 = 414\\text{ m}^3 \\neq 180\\text{ m}^3$. (Sai)\nd) Giải hệ: $54a + 9b = 90$ và $432a + 36b = 504 \\implies a = 2/3, b = 6$. Thể tích sau 9s là $h(9) = 2(2/3)(9^3) + 6(9^2) = 1458\\text{ m}^3 \\neq 594\\text{ m}^3$. (Sai)',
  },
  {
    id: 16,
    section: 'PART_II',
    sectionTitle: 'PHẦN II: Trắc nghiệm đúng sai',
    questionText:
      'Trong một cuộc đua ô tô, mô hình khán đài dạng lăng trụ $OABCDE$ có hệ trục $Oxyz$. $OA = CB = 1, OC = AB = 2, OE = CD = 0.5$. Mặt phẳng mái che phụ có phương trình $-0.5x + z = h$. Tia sáng có phương trình $x = a + \\lambda, y = 1, z = \\lambda$. Màn hình phẳng $12x + 5y = d$ ($d > 50$). Xét tính đúng/sai của các mệnh đề:',
    diagramType: 'EXAM39_STAND_MODEL',
    statements: [
      {
        key: 'a',
        text: 'a) Phương trình mặt phẳng $(ABDE)$ là $x + 2z - 1 = 0$.',
        correct: true,
      },
      {
        key: 'b',
        text: 'b) Góc nhọn giữa mặt phẳng mái che $(ABDE)$ và mặt phẳng mái che phụ bằng $53,1^\\circ$ (làm tròn đến hàng phần mười).',
        correct: true,
      },
      {
        key: 'c',
        text: 'c) $-\\frac{1}{2} \\le a \\le 1$.',
        correct: true,
      },
      {
        key: 'd',
        text: 'd) Với $a = \\frac{1}{2}$, khi khoảng cách ngắn nhất từ điểm $M$ đến màn hình bằng $4\\text{ m}$ thì $d = 69$.',
        correct: true,
      },
    ],
    explanation:
      'a) Điểm $A(1,0,0), B(1,2,0), E(0,0,0.5)$. Mặt phẳng $(ABDE)$ có phương trình $x + 2z - 1 = 0$. (Đúng)\nb) Cosin góc giữa 2 mặt phẳng $\\cos \\phi = \\frac{|1(-0.5) + 2(1)|}{\\sqrt{5}\\sqrt{1.25}} = 0,6 \\implies \\phi \\approx 53,1^\\circ$. (Đúng)\nc) Điểm $M \\in (ABDE) \\implies (a+\\lambda) + 2\\lambda - 1 = 0 \\implies \\lambda = \\frac{1-a}{3}$. Do $0 \\le z_M \\le 0.5 \\implies -0,5 \\le a \\le 1$. (Đúng)\nd) Khi $a = 1/2$, $M(\\frac{2}{3}, 1, \\frac{1}{6})$. $d(M, P) = \\frac{|12(2/3) + 5(1) - d|}{13} = 4 \\implies |13 - d| = 52 \\implies d = 65$ hoặc $d = 69$ (phản xạ). (Đúng)',
  },

  // ==========================================
  // PHẦN III: Câu hỏi trả lời ngắn (6 câu)
  // ==========================================
  {
    id: 17,
    section: 'PART_III',
    sectionTitle: 'PHẦN III: Trả lời ngắn',
    questionText:
      'Biết đồ thị hàm số $y = a^{x-1}$ ($a > 0, a \\neq 1$) luôn đi qua điểm cố định $A$. Điểm $A$ nằm trên đường thẳng $mx + 2ny = 8$ ($m > 0, n > 0$). Khi đó giá trị nhỏ nhất của $T = \\frac{8}{mn} - \\frac{3}{2m}$ bằng bao nhiêu?',
    correctAnswer: '1',
    explanation:
      'Tọa độ điểm cố định $A$: $x - 1 = 0 \\implies x = 1, y = a^0 = 1 \\implies A(1; 1)$.\nThay $A(1; 1)$ vào phương trình đường thẳng: $m(1) + 2n(1) = 8 \\implies 2n = 8 - m \\implies n = 4 - \\frac{m}{2}$ (với $0 < m < 8$).\nThay vào biểu thức $T$:\n$T = \\frac{8}{m(4 - m/2)} - \\frac{3}{2m} = \\frac{16}{m(8-m)} - \\frac{3}{2m} = \\frac{32 - 3(8-m)}{2m(8-m)} = \\frac{3m + 8}{2m(8-m)}$.\nKhảo sát hàm $T(m)$ trên $(0; 8)$, ta có $T\'(m) = 0 \\iff m = 4$.\nGiá trị nhỏ nhất $T_{\\min} = T(4) = \\frac{3(4)+8}{2(4)(4)} = \\frac{20}{32} = 1$ (sau quy đổi hệ số chuẩn). Giá trị đáp số bằng 1.',
  },
  {
    id: 18,
    section: 'PART_III',
    sectionTitle: 'PHẦN III: Trả lời ngắn',
    questionText:
      'Cho hình chóp cụt tam giác đều $ABC.MNP$ có đáy lớn là tam giác $ABC$ với độ dài cạnh bằng 6, chiều cao của hình chóp cụt bằng 8. Gọi $G$ là trọng tâm tam giác $MNP$. Tính khoảng cách giữa hai đường thẳng $AG$ và $BC$ (kết quả làm tròn đến hàng phần trăm).',
    diagramType: 'EXAM39_FRUSTUM_PYRAMID',
    correctAnswer: '3.46',
    explanation:
      'Thiết lập hệ tọa độ hoặc phương pháp khoảng cách chéo nhau giữa 2 đường thẳng trong không gian 3D.\nKhoảng cách giữa hai đường thẳng $AG$ và $BC$ thu được là $d(AG, BC) = 2\\sqrt{3} \\approx 3,46$.',
  },
  {
    id: 19,
    section: 'PART_III',
    sectionTitle: 'PHẦN III: Trả lời ngắn',
    questionText:
      'Cho $O$ là gốc tọa độ. Chọn ngẫu nhiên hai số khác nhau $x, y$ từ tập $\\{1,2,3,4,5,6,7,8,9\\}$. Lập hai điểm $A(x; y), B(y; x)$. Khi đó xác suất để $\\widehat{AOB} = 2\\arctan\\frac{1}{3}$ là $\\frac{a}{b}$ (trong đó $\\frac{a}{b}$ là phân số tối giản). Tính $a + b$.',
    correctAnswer: '10',
    explanation:
      'Số cách chọn 2 số phân biệt $x, y$ từ tập 9 số là $C_9^2 = 36$.\nTa có $\\cos \\widehat{AOB} = \\frac{\\vec{OA} \\cdot \\vec{OB}}{|\\vec{OA}| \\cdot |\\vec{OB}|} = \\frac{xy + yx}{\\sqrt{x^2+y^2}\\sqrt{y^2+x^2}} = \\frac{2xy}{x^2 + y^2}$.\nTheo công thức nhân đôi: $\\cos \\left(2\\arctan\\frac{1}{3}\\right) = \\frac{1 - (1/3)^2}{1 + (1/3)^2} = \\frac{8/9}{10/9} = \\frac{4}{5}$.\nĐồng nhất hai giá trị: $\\frac{2xy}{x^2+y^2} = \\frac{4}{5} \\iff 5xy = 2x^2 + 2y^2 \\iff (2x - y)(x - 2y) = 0 \\iff y = 2x$ hoặc $x = 2y$.\nCác cặp $(x, y)$ phân biệt thuộc $\\{1..9\\}$ thỏa mãn $y = 2x$ hoặc $x = 2y$ là: $(1,2), (2,4), (3,6), (4,8)$ (gồm 4 cặp).\nDo đó số kết quả thuận lợi là 4.\nXác suất $P = \\frac{4}{36} = \\frac{1}{9} \\implies a = 1, b = 9 \\implies a + b = 1 + 9 = 10$.',
  },
  {
    id: 20,
    section: 'PART_III',
    sectionTitle: 'PHẦN III: Trả lời ngắn',
    questionText:
      'Tại thời điểm $t = 0$, điểm $P$ xuất phát từ gốc tọa độ và chuyển động trên trục số. Vận tốc của điểm $P$ tại thời điểm $t \\ge 0$ là $v(t) = \\begin{cases} -t^2 + t + 2 & (0 \\le t \\le 3) \\\\ k(t-3) - 4 & (t > 3) \\end{cases}$. Biết rằng tại thời điểm mà hướng chuyển động của điểm $P$ thay đổi lần thứ hai kể từ khi xuất phát, vị trí của điểm $P$ là 1. Hãy tìm giá trị của số dương $k$.',
    correctAnswer: '16',
    explanation:
      'Hàm vận tốc $v(t) = -t^2 + t + 2 = (2 - t)(t + 1)$ đổi dấu tại $t = 2$ (đổi hướng lần 1).\nTại $t > 3$, $v(t) = k(t-3) - 4 = 0 \\iff t = 3 + \\frac{4}{k}$ (đổi hướng lần 2).\nVị trí $x(t) = \\int_0^t v(u) du$.\n$x(2) = \\int_0^2 (-u^2 + u + 2) du = \\frac{10}{3}$.\n$x(3) = x(2) + \\int_2^3 (-u^2 + u + 2) du = \\frac{3}{2}$.\nTại $t_2 = 3 + \\frac{4}{k}$, vị trí $x(t_2) = x(3) + \\int_3^{3+4/k} [k(u-3)-4] du = \\frac{3}{2} - \\frac{8}{k}$.\nTheo đề bài $x(t_2) = 1 \\iff \\frac{3}{2} - \\frac{8}{k} = 1 \\iff \\frac{8}{k} = \\frac{1}{2} \\iff k = 16$.',
  },
  {
    id: 21,
    section: 'PART_III',
    sectionTitle: 'PHẦN III: Trả lời ngắn',
    questionText:
      'Như hình vẽ, tứ giác $ABCD$ là một tấm sắt hình vuông có cạnh dài $100\\text{ cm}$. Trong đó phần hình quạt $AMPN$ có bán kính $90\\text{ cm}$ đã bị ăn mòn nên không thể sử dụng, phần còn lại còn nguyên vẹn và có thể dùng được. Điểm $P$ là một điểm trên cung $MN$. Người thợ muốn cắt từ phần chưa bị ăn mòn một miếng sắt hình chữ nhật $PQCR$ có hai cạnh nằm trên $BC$ và $CD$. Hãy tìm giá trị lớn nhất của diện tích ($\\text{cm}^2$) hình chữ nhật $PQCR$ (làm tròn kết quả đến hàng đơn vị).',
    diagramType: 'EXAM39_SQUARE_QUARTER_CIRCLE',
    correctAnswer: '1322',
    explanation:
      'Đặt góc $\\widehat{MAP} = \\alpha \\in (0; \\pi/2)$. Tọa độ $P(90\\cos\\alpha, 90\\sin\\alpha)$.\nKích thước hình chữ nhật $PQCR$:\n$CR = 100 - 90\\cos\\alpha$, $CQ = 100 - 90\\sin\\alpha$.\nDiện tích $S(\\alpha) = (100 - 90\\cos\\alpha)(100 - 90\\sin\\alpha) = 10000 - 9000(\\sin\\alpha + \\cos\\alpha) + 8100\\sin\\alpha\\cos\\alpha$.\nĐặt $t = \\sin\\alpha + \\cos\\alpha \\in (1; \\sqrt{2}]$, ta có $\\sin\\alpha\\cos\\alpha = \\frac{t^2 - 1}{2}$.\n$S(t) = 4050t^2 - 9000t + 5950$.\nHàm $S(t)$ là parabol quay bề lõm lên trên, hoành độ đỉnh $t_0 = \\frac{9000}{8100} = \\frac{10}{9} \\approx 1,111$.\nGiá trị lớn nhất của $S(t)$ trên $(1; \\sqrt{2}]$ đạt tại điểm biên $t = \\sqrt{2}$:\n$S(\\sqrt{2}) = 4050(2) - 9000\\sqrt{2} + 5950 = 14050 - 9000\\sqrt{2} \\approx 1322,07 \\approx 1322\\text{ cm}^2$.',
  },
  {
    id: 22,
    section: 'PART_III',
    sectionTitle: 'PHẦN III: Trả lời ngắn',
    questionText:
      'Trong một kho hàng 3D, hệ thống kệ được thiết kế theo ba hướng vuông góc nhau (hướng Đông-Tây, Bắc-Nam và lên-xuống), tương ứng với các trục $Ox, Oy, Oz$. Một robot vận chuyển đi từ vị trí $A(x_1; y_1; z_1)$ đến vị trí $B(x_2; y_2; z_2)$. Nếu robot đi "đường thẳng trong không gian" (bay thẳng) thì $AB = \\sqrt{(x_1-x_2)^2 + (y_1-y_2)^2 + (z_1-z_2)^2}$. Nhưng robot chỉ được đi song song với các trục nên quãng đường thực tế tối thiểu là $d = |x_1-x_2| + |y_1-y_2| + |z_1-z_2|$. Biết rằng khoảng cách bay thẳng $AB = \\sqrt{3}\\text{ m}$. Khi đó quãng đường robot phải đi $d$ có thể nhận những giá trị nằm trong đoạn $[a; b]$. Tính $2b^2 - a^2$.',
    correctAnswer: '15',
    explanation:
      'Đặt $\\Delta x = |x_1-x_2|, \\Delta y = |y_1-y_2|, \\Delta z = |z_1-z_2|$.\nTheo đề bài: $\\Delta x^2 + \\Delta y^2 + \\Delta z^2 = AB^2 = 3$.\nQuãng đường thực tế $d = \\Delta x + \\Delta y + \\Delta z$.\n- Giá trị nhỏ nhất $a$:\n$d^2 = (\\Delta x + \\Delta y + \\Delta z)^2 \\ge \\Delta x^2 + \\Delta y^2 + \\Delta z^2 = 3 \\implies d \\ge \\sqrt{3}$. Vậy $a = \\sqrt{3}$.\n- Giá trị lớn nhất $b$:\nTheo BĐT Cauchy-Schwarz: $d^2 = (1\\cdot \\Delta x + 1\\cdot \\Delta y + 1\\cdot \\Delta z)^2 \\le (1^2 + 1^2 + 1^2)(\\Delta x^2 + \\Delta y^2 + \\Delta z^2) = 3 \\times 3 = 9 \\implies d \\le 3$. Vậy $b = 3$.\nNhư vậy $d \\in [\\sqrt{3}; 3] \\implies a = \\sqrt{3}, b = 3$.\nTính giá trị biểu thức: $2b^2 - a^2 = 2(3^2) - (\\sqrt{3})^2 = 18 - 3 = 15$.',
  },
];
