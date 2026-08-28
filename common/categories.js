/*
 * Contains all supported expense categories.
 * Keeping the categories in one place makes them easy to reuse
 * and ensures that only valid categories are accepted by the system.
 */

// Categories that can be assigned to a cost item
const CATEGORIES = [
    "housing",
    "food",
    "sport",
    "health",
    "education"
];

// Make the category list available to other modules
module.exports = CATEGORIES;