export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center md:flex md:justify-between md:items-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Fruit Garden Market. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 flex justify-center space-x-6 text-sm text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">
            เกี่ยวกับเรา
          </span>
          <span className="hover:text-blue-600 cursor-pointer">ติดต่อสวน</span>
          <span className="hover:text-blue-600 cursor-pointer">
            นโยบายความเป็นส่วนตัว
          </span>
        </div>
      </div>
    </footer>
  );
}
