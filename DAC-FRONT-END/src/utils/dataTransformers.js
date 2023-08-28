export function parseProperties(properties) {
    return properties.map(property => {
        const rawDate = property.creation_date;
        const formattedDate = new Date(rawDate).toLocaleDateString();

        return {
            Id: property.Id,
            Nombre: property.name,
            Descripción: property.description,
            Estado: property.state,
            Provincia: property.province,
            Cantón: property.canton,
            Distrito: property.district,
            "Dirección Exacta": property.exact_address,
            "Fecha de Creación": formattedDate
        };
    });
}

export function parseData(data, dataType){

    switch (dataType) {
        case 'Properties':
            data = parseColumnNames(data);
            break;
    
        default:
           
            break;
    }
    return data
}


function parseColumnNames(columns) {
    const translations = {
        "Id": "ID",
        "name": "Nombre",
        "description": "Descripción",
        "user_id": "ID de Usuario",
        "state": "Estado",
        "creation_date": "Fecha de Creación",
        "user_info_name": "Nombre de Usuario",
        "province": "Provincia",
        "canton": "Cantón",
        "district": "Distrito",
        "exact_address": "Dirección Exacta"
    };

    return columns.map(column => translations[column] || column);
}