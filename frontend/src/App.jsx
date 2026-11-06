import { Outlet } from 'react-router-dom';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';

export default function App() {
	return <div className="min-h-screen bg-beige grid-bg-fine"><AnnouncementBar /><Navbar /><main className="pt-[118px]"><Outlet /></main><Footer /></div>;
}
