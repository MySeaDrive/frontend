import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout({ children }) {

  return (
    <section>   
        <TopNavbar/>
        {children}
    </section>
  );
}