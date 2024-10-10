import React from 'react';
import { TitleScreenProps } from '../lib/interface';
import { version } from '../../package.json';

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-6">nono</h1>
      <button
        className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
        onClick={onStart}
      >
        スタート
      </button>
      {/* バージョン番号を左下に表示 */}
      <div className="absolute left-2 bottom-2 text-sm text-white opacity-75">
        Version {version}
      </div>
    </div>
  );
};

export default TitleScreen;
