import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout({ children }) {

  return (
    <section className="bg-zinc-50 min-h-screen">   
        <TopNavbar/>
        {children}
    </section>
  );
}