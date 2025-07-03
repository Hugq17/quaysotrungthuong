import React, { useState, useRef } from "react";

const prizes = [
  "Giảm 5k",
  "Chúc bạn\nmay mắn lần sau",
  "Combo 10\nmẫu ngẫu nhiên",
  "Giảm 10k",
  "Tặng 1 nam châm\n ngẫu nhiên",
  "Tặng 1 ghim cài\n ngẫu nhiên"
];

const colors = ["#ffcc00", "#ff6666", "#66ccff", "#99ff99", "#ff9966", "#cc99ff"];

export default function SpinWheelApp() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState("");
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef(null);

  const drawWheel = (rotation = 0) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const arcSize = (2 * Math.PI) / prizes.length;

    for (let i = 0; i < prizes.length; i++) {
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.fillStyle = colors[i % colors.length];
      ctx.arc(150, 150, 150, arcSize * i + rotation, arcSize * (i + 1) + rotation);
      ctx.fill();

      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(arcSize * i + arcSize / 2 + rotation);
      ctx.fillStyle = "#000";
      ctx.font = "bold 12px sans-serif";
      const lines = prizes[i].split("\n");
      lines.forEach((line, index) => {
        ctx.fillText(line, 40, (index - (lines.length - 1) / 2) * 14);
      });
      ctx.restore();
    }
  };

  const spinWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rotation = 0;
    let angle = 0;
    let spinCount = 0;
    const spins = Math.floor(Math.random() * 10 + 10);

    const interval = setInterval(() => {
      angle += 0.2;
      rotation += angle;
      ctx.clearRect(0, 0, 300, 300);
      drawWheel(rotation);

      if (++spinCount > spins) {
        clearInterval(interval);
        const arcSize = (2 * Math.PI) / prizes.length;
        let index = prizes.length - Math.floor(((rotation % (2 * Math.PI)) / arcSize)) - 1;
        const prize = prizes[index < 0 ? 0 : index % prizes.length].replace(/\n/g, " ");
        setResult(`🎉 Kết quả: ${prize} 🎉`);

        fetch("https://script.google.com/macros/s/AKfycbztz_fQ4nzDPp7eYc2g6OYRAyGwMHjhZN-ZvMgiEO9XH90d00Bm8UI6EBjszI1_tWz67Q/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `phone=${encodeURIComponent(phone)}&prize=${encodeURIComponent(prize)}`,
        });

        setSpinning(false);
      }
    }, 100);
  };

  const startGame = () => {
    if (!phone || phone.length < 9) {
      alert("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }
    setResult("");
    setSpinning(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    drawWheel();
    setTimeout(() => spinWheel(), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-2 text-blue-700">🎁 Quay số trúng thưởng 🎁</h2>
        <p className="mb-4 text-gray-600">Nhập số điện thoại của bạn để tham gia</p>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={startGame}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          disabled={spinning}
        >
          {spinning ? "Đang quay..." : "Tham gia"}
        </button>
        <canvas
          ref={canvasRef}
          width="300"
          height="300"
          className={`mx-auto mt-6 ${spinning || result ? "block" : "hidden"}`}
        ></canvas>
        {result && <div className="mt-6 font-semibold text-lg text-green-700">{result}</div>}
      </div>
    </div>
  );
}
