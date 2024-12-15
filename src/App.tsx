import type React from "react";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthCallback from "./components/AuthCallback";
import EditScreen from "./components/EditScreen";
import GameScreen from "./components/GameScreen";
import TitleScreen from "./components/TitleScreen";
import { fetchPuzzles } from "./lib/api";

const App: React.FC = () => {
	const [currentScreen, setCurrentScreen] = useState("title");
	const [puzzleId, setPuzzleId] = useState(0);
	const [puzzleSize, setPuzzleSize] = useState(0);

	const startGame = async () => {
		try {
			const puzzles = await fetchPuzzles();
			console.log(puzzles);
			const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
			setPuzzleId(randomPuzzle.puzzle_id);
			setPuzzleSize(randomPuzzle.puzzle_size);
			setCurrentScreen("game");
		} catch (error) {
			console.error(error);
			alert("Failed to start the game");
		}
	};

	const startEdit = () => {
		setCurrentScreen("edit");
	};

	// タイトルに戻る
	const backToTitle = () => {
		setCurrentScreen("title");
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case "title":
				return <TitleScreen onStart={startGame} onEdit={startEdit} />;
			case "game":
				return (
					<GameScreen
						puzzleId={puzzleId}
						puzzleSize={puzzleSize}
						onBack={backToTitle}
					/>
				);
			case "edit":
				return <EditScreen onBack={backToTitle} />;
		}
	};

	return (
		<Router>
			<Routes>
				<Route path="/" element={renderScreen()} />
				<Route path="/auth/callback" element={<AuthCallback />} />
			</Routes>
		</Router>
	);
};

export default App;
