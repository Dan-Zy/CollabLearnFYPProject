import React from 'react';

export function GenreSelector({ selectedGenre, setSelectedGenre }) {
  const genres = ['AI', 'HCI', 'SE', 'DSA', 'ML'];

  return (
    <div className="flex justify-center mt-4">
      <nav className="w-full bg-light py-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="container mx-auto flex justify-between items-center">
            {genres.map((genre) => (
              <a
                key={genre}
                className={`navelement mx-2  hover:underline ${selectedGenre === genre ? 'active text-indigo-500' : ''}`}
                href="#"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
