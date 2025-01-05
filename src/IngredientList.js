import React from "react";

const IngredientList = ({ steps }) => {
    return (
        <div className="mb-3">
            <label className="form-label">Steps</label>
            <ul className="list-group">
                {steps.map((step, index) => (
                    <li key={index} className="list-group-item">
                        <strong>{step.steporder}. {step.title}</strong> - {step.instructions}
                        {step.image && (
                            <img
                                src={step.image}
                                alt={`Step ${step.steporder}`}
                                style={{ width: "50px", height: "50px", marginLeft: "10px" }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientList;