const SlackLoginButton = () => {
  // const clientId = '2210535565.9217427988915';
  // const redirectUri = 'https://hackclub-cdn.khaled.hackclub.app/api/slack/callback';
  // const scope = 'identity.basic,identity.email,identity.avatar,identity.team';

  const handleLogin = () => {
    //const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    const url = 'https://slack.com/openid/connect/authorize?scope=openid&amp;response_type=code&amp;redirect_uri=https%3A%2F%2Fhackclub-cdn.khaled.hackclub.app%2Fapi%2Fslack%2Fcallback&amp;client_id=2210535565.9217427988915';
    window.location.href = url;
  };

  return <button onClick={handleLogin}>Login with Slack</button>;
};

export default SlackLoginButton;