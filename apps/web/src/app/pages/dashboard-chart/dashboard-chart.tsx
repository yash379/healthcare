import { Card, Typography } from '@mui/material';
import styles from './dashboard-chart.module.scss';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/* eslint-disable-next-line */
export interface DashboardChartProps {}

export function DashboardChart(props: DashboardChartProps) {

  // Sample data
    const data = [
      { month: 'Apr', Female: 100, Male: 80 },
      { month: 'May', Female: 150, Male: 130 },
      { month: 'Jun', Female: 50, Male: 50 },
      { month: 'Jul', Female: 450, Male: 420 },
      { month: 'Aug', Female: 100, Male: 90 },
      { month: 'Sep', Female: 120, Male: 110 },
      { month: 'Oct', Female: 500, Male: 500 },
      { month: 'Nov', Female: 110, Male: 100 },
      { month: 'Dec', Female: 130, Male: 120 },
    ];


  return (
    
    <Card style={{ width: '100%', height: 430 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#064B4F"
        marginTop={3}
        marginLeft={3}
      >
        Patients Analysis Overview
      </Typography>
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{ top: 40, right: 30, left: 5, bottom: 40 }}
        barCategoryGap="15%"
      >
        
        {/* Grid lines */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* X-axis (months) */}
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 14, fill: '#000' }}
        />

        {/* Y-axis */}
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 14, fill: '#000' }}
        />

        {/* Tooltip */}
        <Tooltip />

        {/* Legend positioned top-right */}
        <Legend
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          wrapperStyle={{ top: 1, right: 20, }}
          formatter={(value) => <span style={{ color: '#264e58', fontWeight: 'bold' }}>{value}</span>}
        />

        {/* Bars for female and male */}
        <Bar
          dataKey="Female"
          fill="#71c3c9"
          radius={[10, 10, 0, 0]}
          barSize={60}
        />
        <Bar
          dataKey="Male"
          fill="#264e58"
          radius={[10, 10, 0, 0]}
          barSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  </Card>
  );
}

export default DashboardChart;
