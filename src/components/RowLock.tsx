import React from "react";
import { FaEdit } from "react-icons/fa";
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
	return (
		<>
			{isLocked ? (
				<>
					<td className="none-col">
						<Tooltip placement="right">
							<div className="row-lock"></div>
						</Tooltip>
						<FaEdit size={"18px"} className="editLock" onClick={onEditClick} />
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
