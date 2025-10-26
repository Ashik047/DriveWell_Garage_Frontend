export const handleChange = (event, stateSetter) => {
    const [name, value] = [event.target.name, event.target.value];
    stateSetter(prev => ({ ...prev, [name]: value }));
};

export const handleReset = (details, setDetails) => {
    const resetDetails = Object.keys(details).reduce((acc, key) => {
        acc[key] = "";
        return acc;
    }, {});

    setDetails(resetDetails);
}

export const handleEditDetails = (data, details, setDetails, setModalStatus, setModalType) => {
    setModalType("Edit");
    Object.entries(details).forEach(([key, value]) => {
        setDetails(prev => ({ ...prev, [key]: data[key] }));
    });
    setModalStatus(true);
};
export const handleCloseEditDetails = (details, setDetails, setModalStatus, setModalType, setFormSubmitStatus) => {
    handleReset(details, setDetails);
    setModalStatus(false);
    setFormSubmitStatus(false);
    setModalType("");
};

export const handleAdd = (setModalStatus, setModalType) => {
    setModalStatus(true);
    setModalType("Add");
};