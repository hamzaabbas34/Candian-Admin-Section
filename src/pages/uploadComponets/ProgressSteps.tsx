import React from "react";
import { CheckCircle } from "lucide-react";
import { Settings, FileSpreadsheet, Image, FileCheck } from "lucide-react";

interface ProgressStepsProps {
	step: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ step }) => {
	const steps = [
		{ number: 1, title: "Configuration", icon: Settings },
		{ number: 2, title: "Excel Data", icon: FileSpreadsheet },
		{ number: 3, title: "Images", icon: Image },
		{ number: 4, title: "Validation", icon: FileCheck },
	];

	return (
		<div className="mb-8">
			<div className="flex justify-between items-start relative">
				{steps.map((stepItem, index) => {
					const Icon = stepItem.icon;
					const isActive = step >= stepItem.number;
					const isCompleted = step > stepItem.number;

					return (
						<div
							key={stepItem.number}
							className="flex flex-col items-center flex-1 relative z-10">
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
									isCompleted
										? "bg-green-500 border-green-500 text-white shadow-lg"
										: isActive
										? "bg-primary border-primary text-white shadow-lg"
										: "bg-white border-gray-300 text-gray-400"
								}`}>
								{isCompleted ? (
									<CheckCircle className="w-6 h-6" />
								) : (
									<Icon className="w-5 h-5" />
								)}
							</div>
							<div
								className={`text-xs font-medium mt-3 text-center transition-colors ${
									isActive || isCompleted ? "text-gray-900" : "text-gray-500"
								}`}>
								{stepItem.title}
							</div>
							{index < steps.length - 1 && (
								<div
									className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 transition-colors ${
										step > stepItem.number ? "bg-green-500" : "bg-gray-200"
									}`}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ProgressSteps;
