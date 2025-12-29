import React, { useEffect, useState } from "react";
import ProjectApiList from "../api/ProjectApiList";
import axios from "axios";
const { api_moduleList } = ProjectApiList();

const PermittedModuleCard = ({ isOpen, onClose }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                api_moduleList,     // API URL
                {},                 // request body
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
                    },
                }
            );

            if (response?.data?.status === true) {
                setModules(response.data.data || []);
            } else {
                setModules([]);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleModuleClick = (module) => {
        if (module.can_view && !module.is_suspended) {
            window.location.replace(`${module.url}/transfer`);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl h-[80vh] overflow-y-auto relative">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 p-2"
                >
                    ×
                </button>
                <div className="p-6 pt-12">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div>Loading modules...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modules.map((module) => (
                                <div
                                    key={module.id}
                                    onClick={() => handleModuleClick(module)}
                                    className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${module.can_view && !module.is_suspended
                                            ? 'hover:bg-gray-50'
                                            : 'opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={module.image}
                                            alt={module.title}
                                            className="w-16 h-16 mb-3"
                                        />
                                        <h3 className="text-lg font-semibold">{module.title}</h3>
                                        <p className="text-sm text-gray-600">{module.module_name}</p>
                                        {module.is_suspended && (
                                            <span className="text-red-500 text-xs mt-1">Suspended</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermittedModuleCard;