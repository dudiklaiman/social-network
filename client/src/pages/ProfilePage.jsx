import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import MainLayout from "src/widgets/MainLayout";
import api from "src/utils/apiRequests";


const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);


  useEffect(() => {
    const getUser = async () => {
      const user = (await api(token).get(`users/${userId}`)).data;
      setUser(user);
    }
    getUser();
  }, []);

  return user ? <MainLayout user={user} isProfile /> : null;
};

export default ProfilePage;
