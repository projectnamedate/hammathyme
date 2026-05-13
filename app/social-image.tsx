export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const LETTERS = [
  ["h", "-0.018em"],
  ["a", "-0.055em"],
  ["m", "-0.045em"],
  ["m", "-0.020em"],
  ["e", "-0.022em"],
  ["r", "0.007em"],
] as const;

export function HammerSocialImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#FAEEE9",
        color: "#1F0707",
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 44,
          display: "flex",
          border: "1px solid rgba(31, 7, 7, 0.16)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 62,
          display: "flex",
          fontSize: 18,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#6E2C27",
        }}
      >
        jeff hammer / ai producer
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 62,
          display: "flex",
          fontSize: 18,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#6E2C27",
        }}
      >
        la / ny / remote
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 184,
          display: "flex",
          alignItems: "baseline",
          whiteSpace: "nowrap",
        }}
      >
        {LETTERS.map(([letter, marginRight], index) => (
          <div
            key={`${letter}-${index}`}
            style={{
              display: "flex",
              fontSize: 216,
              fontWeight: 900,
              lineHeight: 0.84,
              letterSpacing: 0,
              marginRight,
            }}
          >
            {letter}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "#F28E86",
            marginLeft: -2,
            transform: "translateY(4px)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 86,
          bottom: 78,
          display: "flex",
          width: 72,
          height: 1,
          background: "#A66860",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 182,
          bottom: 66,
          display: "flex",
          fontSize: 32,
          lineHeight: 1.2,
          color: "#3D1413",
        }}
      >
        brand systems · agents · motion · visual media · websites
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 66,
          display: "flex",
          fontSize: 18,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#A66860",
        }}
      >
        hammathyme.vercel.app
      </div>
    </div>
  );
}
