import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/users.context';
import { signOutUser, getUserByUsername, retrieveProfileImage } from '../../utils/firebase/firebase.utils';

const UserProfile = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { username } = useParams();
    const [userObject, setUserObject] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const fetchUserObject = async () => {
            if (username) {
                try {
                    console.log(`Fetching user object for username: ${username}`);
                    const user = await getUserByUsername(username);
                    if (user) {
                        console.log('User object retrieved:', user);
                        setUserObject(user);
                    } else {
                        console.error('User not found');
                    }
                } catch (error) {
                    console.error('Failed to retrieve user:', error);
                }
            } else {
                console.error('Username is undefined');
            }
        };

        fetchUserObject();
    }, [username]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (username && username.uid) {
                try {
                    console.log(`Retrieving profile image for user UID: ${userObject.uid}`);
                    const imageUrl = await retrieveProfileImage(userObject);
                    if (imageUrl) {
                        console.log('Profile image URL retrieved:', imageUrl);
                        setProfileImageUrl(imageUrl);
                    } else {
                        console.error('No profile image found');
                    }
                } catch (error) {
                    console.error('Failed to retrieve profile image:', error);
                } finally {
                    setLoadingImage(false);
                }
            } else {
                setLoadingImage(false);
                console.error('User object is null or missing UID');
            }
        };

        fetchProfileImage();
    }, [userObject]);

    const signOutHandler = async () => {
        await signOutUser();
        setCurrentUser(null);
        setProfileImageUrl(''); // Reset profile image on sign out
    };

    return (
        <div className="profile-page container">
            {loadingImage ? (
                <p>Loading profile image...</p>
            ) : profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" />
            ) : (
                <p>No profile image available</p>
            )}
            <h1>Welcome, {userObject?.displayName || 'User'}!</h1>
            {currentUser && <button onClick={signOutHandler}>Sign Out</button>}
        </div>
    );
};

export default UserProfile;
