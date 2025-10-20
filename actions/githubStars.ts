
const getGithubStars = async (): Promise<number> => {
    const response = await fetch(
        'https://api.github.com/repos/RossiFire/randomui',{
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            }
        }
    );
    const data = await response.json();
    return data.stargazers_count;
}


export { getGithubStars };