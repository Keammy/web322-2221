var employees = [
    {
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank",
        imageUrl: "person1.jpg",
        visible: true
    },
    {
        name: "Frank",
        age: 40,
        occupation: "Project Manager",
        company: "RBC",
        imageUrl: "person2.jpg",
        visible: false
    },
    {
        name: "Jane",
        age: 33,
        occupation: "Manager",
        company: "RBC",
        imageUrl: "person3.jpg",
        visible: true
    }
];

module.exports.getAllEmployees = function() {
    return employees;
};

module.exports.getVisibleEmployees = function() {
    var filtered = [];

    for (var i = 0; i < employees.length; i++) {
        if (employees[i].visible) {
            filtered.push(employees[i]);
        }
    }

    return filtered;
}