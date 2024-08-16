import { Fragment, useContext, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserContext } from "../../contexts/users.context";
import { signOutUser, retrieveProfileImage } from "../../utils/firebase/firebase.utils";

import './navigation.styles.css';

const Navigation = () => {
  const { currentUser, setCurrentUser, profileImageUrl, setProfileImageUrl } = useContext(UserContext);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser) {
        try {
          const imageUrl = await retrieveProfileImage(currentUser);
          setProfileImageUrl(imageUrl);
          console.log("Image URL: " + imageUrl);
        } catch (error) {
          console.error('Failed to retrieve profile image:', error);
        }
      }
    };

    fetchProfileImage();
  }, [currentUser, setProfileImageUrl]);

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    setProfileImageUrl(''); // Reset profile image on sign out
  };

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to='/'>
          {/* Logo can be added here */}
        </Link>
        <div className="nav-links-container">
          <Link className='nav-link' to="/make">Make</Link>
          {currentUser ? (
            <>
              <Link className='nav-link' to={`/user/${currentUser.displayName}`}>Hi {currentUser.displayName}</Link>
              {profileImageUrl && <img src={profileImageUrl} className="pfp-mini" alt="Profile" />}
            </>
          ) : (
            <Link className='nav-link' to="/auth">Sign In</Link>
          )}
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
}

export default Navigation;
