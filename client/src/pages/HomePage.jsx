import { useSelector } from "react-redux";
import MainLayout from 'src/layout/MainLayout';


const HomePage = () => {
	const user = useSelector((state) => state.user);

	return <MainLayout user={user} />
}

export default HomePage;
