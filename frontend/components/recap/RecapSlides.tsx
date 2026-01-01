import { YearRecap } from "@/types/recap";

export function IntroSlide({ year }: { year: number }) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">Your {year} ✨</h1>
      <p className="text-gray-500">Let’s rewind your year</p>
    </div>
  );
}

export function TotalMemoriesSlide({ count }: { count: number }) {
  return (
    <div className="text-center space-y-4">
      <p className="text-gray-500">You captured</p>
      <h1 className="text-5xl font-bold">{count}</h1>
      <p className="text-gray-500">good moments</p>
    </div>
  );
}

export function HappiestMonthSlide({ month }: { month: string }) {
  return (
    <div className="text-center space-y-4">
      <p className="text-gray-500">Your happiest month was</p>
      <h1 className="text-5xl font-bold">{month}</h1>
    </div>
  );
}

export function MoodSlide({ mood }: { mood: string }) {
  return (
    <div className="text-center space-y-4">
      <p className="text-gray-500">Your year felt like</p>
      <h1 className="text-4xl font-bold capitalize">{mood}</h1>
    </div>
  );
}

export function SummarySlide({ text }: { text: string }) {
  return (
    <div className="max-w-xl text-center space-y-4">
      <p className="text-gray-500">A note from your year</p>
      <p className="text-lg">{text}</p>
    </div>
  );
}
