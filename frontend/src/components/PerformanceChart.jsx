import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const PerformanceChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--sub-color)' }}>Performance History</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="time"
                        stroke="var(--sub-color)"
                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: 'var(--sub-color)' }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke="var(--main-color)"
                        label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: 'var(--main-color)' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="var(--accent-color)"
                        label={{ value: 'Accuracy (%)', angle: 90, position: 'insideRight', fill: 'var(--accent-color)' }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--sub-color)',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="wpm"
                        stroke="var(--main-color)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="WPM"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="accuracy"
                        stroke="var(--accent-color)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Accuracy (%)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
