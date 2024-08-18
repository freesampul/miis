import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/users.context';
import { signOutUser, retrieveProfileImage, getUserByUsername } from '../../utils/firebase/firebase.utils';

const UserProfile = () => {
    const { currentUser, setCurrentUser, profileImageUrl, setProfileImageUrl } = useContext(UserContext);
    const { username } = useParams();
    const [displayedProfileImage, setDisplayedProfileImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isCancelled = false; // To prevent state updates if the component unmounts

        const fetchUserProfileImage = async () => {
            setLoading(true);
            setError(null);

            try {
                const trimmedUsername = username.trim();
                console.log("Received and trimmed username from URL params:", `"${trimmedUsername}"`);

                if (trimmedUsername) {
                    console.log(`Fetching user for trimmed username: "${trimmedUsername}"`);
                    const user = await getUserByUsername(trimmedUsername);

                    if (user && user.uid) {
                        console.log("Resolved user with UID:", user.uid);

                        const imageUrl = await retrieveProfileImage(user);
                        if (imageUrl) {
                            console.log("Fetched profile image URL:", imageUrl);
                            if (!isCancelled) setDisplayedProfileImage(imageUrl);
                        } else {
                            console.error("No profile image found.");
                            if (!isCancelled) setError('No profile image found.');
                        }
                    } else {
                        console.error(`Failed to resolve user UID for username: "${trimmedUsername}"`);
                        if (!isCancelled) setError('User not found.');
                    }
                } else if (currentUser) {
                    console.log("Using current user's profile image:", profileImageUrl);
                    if (!isCancelled) setDisplayedProfileImage(profileImageUrl);
                } else {
                    if (!isCancelled) setError('No user information available.');
                }
            } catch (err) {
                console.error('Failed to fetch profile image:', err);
                if (!isCancelled) setError('Failed to fetch profile image.');
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };

        fetchUserProfileImage();

        return () => {
            isCancelled = true; // Cleanup function to prevent setting state after unmount
        };
    }, [username, currentUser, profileImageUrl]);

    const signOutHandler = async () => {
        await signOutUser();
        setCurrentUser(null);
        setProfileImageUrl('');
    };

    return (
        <div className="profile-page container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {displayedProfileImage ? (
                        <img src={displayedProfileImage} alt={`${username || currentUser?.displayName}'s Profile`} />
                    ) : (
                        <p>No profile image available</p>
                    )}
                    <h1>Welcome, {username?.trim() || currentUser?.displayName}!</h1>

                    {currentUser && (username?.trim() === currentUser?.displayName) ? (
                        <div>
                            <button onClick={signOutHandler}>Sign Out</button>
                            <button>Edit Profile</button>
                        </div>
                    ) : (
                        <p>You are viewing {username?.trim() || currentUser?.displayName}'s profile.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default UserProfile;
