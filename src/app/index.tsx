import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Player = 'X' | 'O';
type Cell = Player | null;

// Semua kombinasi garis kemenangan
const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom vertikal
  [0, 4, 8], [2, 4, 6],            // Diagonal
];

// Mengembalikan 'X' / 'O' jika ada pemenang, selain itu null
const calculateWinner = (squares: Cell[]): Player | null => {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default function App() {
  // 1. STATE: papan 9 kotak & giliran pemain
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  // 2. Turunan state (dihitung ulang tiap render)
  const winner = calculateWinner(board);
  const isBoardFull = board.every((square) => square !== null);

  // 3. Event handler saat kotak ditekan
  const handlePress = (index: number) => {
    // Abaikan jika kotak sudah terisi atau permainan sudah selesai
    if (board[index] || winner) return;

    // Immutability: buat salinan baru, jangan ubah state langsung
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  // 4. Render satu kotak
  const renderSquare = (index: number) => (
    <TouchableOpacity
      style={styles.square}
      onPress={() => handlePress(index)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.squareText,
          board[index] === 'X' ? styles.textX : styles.textO,
        ]}
      >
        {board[index]}
      </Text>
    </TouchableOpacity>
  );

  // Teks status permainan
  // Dipisah: label + simbol pemain (agar simbol bisa diberi warna sendiri)
  let statusLabel: string;
  let statusPlayer: Player | null = null;
  if (winner) {
    statusLabel = 'Pemenang: ';
    statusPlayer = winner;
  } else if (isBoardFull) {
    statusLabel = 'Permainan Seri (Draw)!';
  } else {
    statusLabel = 'Giliran Pemain: ';
    statusPlayer = xIsNext ? 'X' : 'O';
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.statusRow}>
        <Text style={styles.status}>{statusLabel}</Text>
        {statusPlayer && (
          <Text
            style={[
              styles.statusPlayer,
              statusPlayer === 'X' ? styles.textX : styles.textO,
            ]}
          >
            {statusPlayer}
          </Text>
        )}
      </View>

      {/* Papan 3x3 dengan Flexbox */}
      <View style={styles.board}>
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Mulai Ulang</Text>
      </TouchableOpacity>

      <Text style={styles.author}>Develop by: Rois Abdul Fatah</Text>
    </SafeAreaView>
  );
}

// 5. STYLING
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
  },
  statusPlayer: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  author: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
  },
  board: {
    borderWidth: 4,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  textX: {
    color: '#e74c3c', // merah untuk X
  },
  textO: {
    color: '#3498db', // biru untuk O
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});