import Link from "next/link";

export default function TopMenuItem({ title, pageRef }: { title: string, pageRef: string }) {
  return (
    <Link
      href={pageRef}
      className="px-4 text-center font-sans text-sm text-gray-600 flex items-center justify-center"
    >
      {title}
    </Link>
  );
}
