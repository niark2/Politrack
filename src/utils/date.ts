export const calculateDaysRemaining = (dateString?: string): number => {
    if (!dateString) return 0;
    const target = new Date(dateString);
    const today = new Date();
    const diff = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
