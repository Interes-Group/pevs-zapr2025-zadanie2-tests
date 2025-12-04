const program = {
	kd: (kills, deaths) => deaths === 0 ? 0 : (kills / deaths),
	kda: (kills, assists, deaths) => deaths === 0 ? 0 : ((kills + assists) / deaths),
	kpm: (kills, duration) => duration === 0 ? 0 : (kills / duration),
	apm: (kills, assists, duration) => duration === 0 ? 0 : ((kills + assists) / duration),
	score: (kills, deaths, assists, duration, headshots, teamkills, mvp) => {
		// Performance Score = (KDA × 10) + (KPM × 30) + Headshots × 2 + MVP bonus: +20 - Team Kills × 50
		let score = 0;
		score += program.kda(kills, assists, deaths) * 10;
		score += program.kpm(kills, duration) * 30;
		if (!!headshots) score += headshots * 2;
		if (!!teamkills) score -= teamkills * 50;
		if (!!mvp) score += 20;
		return score;
	},
	rank: (score) => {
		if (score < 0) return "Noob";
		if (score <= 20) return "Iron";
		if (score <= 40) return "Bronze";
		if (score <= 60) return "Silver";
		if (score <= 75) return "Gold";
		if (score <= 85) return "Platinum";
		if (score <= 92) return "Diamond";
		if (score <= 97) return "Master";
		if (score <= 100) return "Grandmaster";
		return "Godlike";
	},
};

export {program};