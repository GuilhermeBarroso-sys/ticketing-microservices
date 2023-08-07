import { Card, Metric, Text } from "@tremor/react";
declare const colorValues: readonly ["slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"];
type Color = (typeof colorValues)[number];
interface IMetricCardProps {
  
  title: string;
  price: number;
  description?: React.ReactNode
  currency?: string
  decorationColor?: Color
  onClick?: () => void
}
export function MetricCard({title,price,currency, decorationColor, onClick, description} : IMetricCardProps)  {

	return (
		<Card onClick={onClick} className="w-full mx-auto cursor-pointer"  decoration="top" decorationColor={decorationColor}>
			<Text>{title}</Text>
			<Metric>{currency ? currency : "R$" } {price}</Metric>
			<Text>{description}</Text>
		</Card>
	);
}