import React, { useState } from "react";
import { TfiUnlock } from "react-icons/tfi";
import "../css/RowLock.css"; // Ensure this file is in the same directory or adjust the path
import { Tooltip } from "react-bootstrap";

interface RowLockProps {
	isLocked: boolean;
	onEditClick?: () => void;
	children: React.ReactNode;
}

const RowLock: React.FC<RowLockProps> = ({
	isLocked,
	onEditClick,
	children,
}) => {
	const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
		top: 0,
		left: 0,
	});

	const handleMouseMove = (e: React.MouseEvent) => {
		setTooltipStyle({
			top: e.clientY + 10,
			left: e.clientX + 10,
			visibility: "visible",
			opacity: 1,
		});
	};

	const handleMouseLeave = () => {
		setTooltipStyle({
			...tooltipStyle,
			visibility: "hidden",
			opacity: 0,
		});
	};

	return (
		<>
			{isLocked ? (
				<>
					<td
						className="none-col"
						onMouseMove={handleMouseMove}
						onMouseLeave={handleMouseLeave}
					>
						<div className="row-lock"></div>
						<div className="tooltip" style={tooltipStyle}>
							Record bloqueado, presiona el botón de desbloqueo a la derecha
							para editar
						</div>
						<TfiUnlock
							size={"18px"}
							className="editLock"
							onClick={onEditClick}
						/>
					</td>
					{children}
				</>
			) : (
				<>
					<td className="none-col"></td>
					{children}
				</>
			)}
		</>
	);
};

export default RowLock;
