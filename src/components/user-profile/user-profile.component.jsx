import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/users.context';
import { signOutUser, getUserByUsername, retrieveProfileImage } from '../../utils/firebase/firebase.utils';

const UserProfile = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { username } = useParams();
    const [userObject, setUserObject] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const user = await getUserByUsername(username);
                console.log("User Object Retrieved: ", user);
                
                if (user) {
                    setUserObject(user);

                    // Check if userObject is properly set before fetching the image
                    if (user.uid) {
                        const imageUrl = await retrieveProfileImage(user);
                        setProfileImageUrl(imageUrl || '');
                    } else {
                        console.error("User UID is undefined.");
                        setProfileImageUrl(''); // Optional: Set a default image URL here
                    }
                } else {
                    setError('User not found');
                }
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    const signOutHandler = async () => {
        await signOutUser();
        setCurrentUser(null); // Clear current user context
    };

    return (
        <div className="profile-page container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {profileImageUrl ? (
                        <img src={profileImageUrl} alt={`${username}'s Profile`} />
                    ) : (
                        <p>No profile image available</p>
                    )}
                    <h1>Welcome, {userObject?.displayName || username}!</h1>

                    {currentUser?.username === username ? (
                        <div>
                            <button onClick={signOutHandler}>Sign Out</button>
                            <button>Edit Profile</button>
                        </div>
                    ) : (
                        <p>You are viewing {username}'s profile.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default UserProfile;
