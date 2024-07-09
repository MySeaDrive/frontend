import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout({ children }) {

  return (
    <section className="bg-gradient min-h-screen">   
        <TopNavbar/>
        {children}
    </section>
  );
}