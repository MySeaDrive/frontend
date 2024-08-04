import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout({ children }) {

  return (
    <section className="bg-white min-h-screen">   
        <TopNavbar/>
        {children}
    </section>
  );
}