const rooms = new Map(); // roomId -> { players: {socketId: {wpm, progress, name, finished}}, status: 'waiting'|'running', words: [] }

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join_room', ({ roomId, playerName }) => {
            socket.join(roomId);

            if (!rooms.has(roomId)) {
                rooms.set(roomId, {
                    players: {},
                    status: 'waiting',
                    words: []
                });
            }

            const room = rooms.get(roomId);
            room.players[socket.id] = {
                name: playerName || 'Guest',
                wpm: 0,
                progress: 0,
                finished: false
            };

            io.to(roomId).emit('room_update', room);
        });

        socket.on('start_race', ({ roomId, words }) => {
            const room = rooms.get(roomId);
            if (room) {
                room.status = 'running';
                room.words = words;
                io.to(roomId).emit('race_started', { words });
            }
        });

        socket.on('update_progress', ({ roomId, progress, wpm }) => {
            const room = rooms.get(roomId);
            if (room && room.players[socket.id]) {
                room.players[socket.id].progress = progress;
                room.players[socket.id].wpm = wpm;
                io.to(roomId).emit('room_update', room);
            }
        });

        socket.on('finish_race', ({ roomId, wpm }) => {
            const room = rooms.get(roomId);
            if (room && room.players[socket.id]) {
                room.players[socket.id].finished = true;
                room.players[socket.id].wpm = wpm;
                room.players[socket.id].progress = 100;

                const allFinished = Object.values(room.players).every(p => p.finished);
                if (allFinished) {
                    room.status = 'finished';
                }

                io.to(roomId).emit('room_update', room);
            }
        });

        socket.on('leave_room', ({ roomId }) => {
            socket.leave(roomId);
            const room = rooms.get(roomId);
            if (room && room.players[socket.id]) {
                delete room.players[socket.id];
                if (Object.keys(room.players).length === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('room_update', room);
                }
            }
        });

        socket.on('disconnect', () => {
            rooms.forEach((room, roomId) => {
                if (room.players[socket.id]) {
                    delete room.players[socket.id];
                    if (Object.keys(room.players).length === 0) {
                        rooms.delete(roomId);
                    } else {
                        io.to(roomId).emit('room_update', room);
                    }
                }
            });
        });
    });
};
