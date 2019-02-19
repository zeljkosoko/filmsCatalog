// 1#  Anonimous function for local storage - lStorage()
var lStorage = (function () {
    var saveToLocalStorage = function (objectName, object) {
        //object must be stringify at first
        var strObj = JSON.stringify(object);
        localStorage.setItem(objectName, strObj);
    };
    var loadFromLocalStorage = function (objectName) {
        //get object by its name
        var jsonStringobj = localStorage.getItem(objectName);
        if (jsonStringobj == null) jsonStringobj = "{}";
        //return java script obj
        return JSON.parse(jsonStringobj);
    };
    var deleteFromLocalStorage = function (objectName) {
        localStorage.removeItem(objectName);
    };
    return {
        //one property for one function
        save: saveToLocalStorage,
        load: loadFromLocalStorage,
        delete: deleteFromLocalStorage
    }
})();//Imediatelly Invoked Function Expression - call of anonimous fun asigned to var lStorage

// 3# lStorage AF method 'load' returns jsObject' with data, and set that object to global variable for usage in other functions

var allFilms = lStorage.load('allFilms');
var allDirectors = lStorage.load('allDirectors');

// 4# show and hide element by id
var showElem = function (id) {
    document.getElementById(id).style.display = "block";
};
var hideElem = function (id) {
    document.getElementById(id).style.display = "none";
};

// 5# elements value - get value/ set new value
var setValue = function (id, newValue) {
    document.getElementById(id).value = newValue;
};
var getValue = function (id) {
    return document.getElementById(id).value;
};

// 6#               ######### Log in & Registration & Forget function
var isUserLoged;    //global var isUserLoged

var loginRegistrationForget = function () {
    //variables that presents loged user in LS
    var logedInUser = lStorage.load("logedInUser");

    //AF that checks name of last user is undefined, with call(IIFE)
    var isSomeUserLoged = (function () {
        if (typeof logedInUser.name == 'undefined') {
            isUserLoged = false;
            hideElem('logOut');
            showElem('logIn');
        } else {
            isUserLoged = true;
            showElem('logOut');
            hideElem('logIn');
        }
    })();

    //AF that shows reg and hide login form
    var showRegisterHideLogIn = function () {
        showElem('register');
        hideElem('logIn');
    };

    // AF Object contructor for User with all property fields
    var User = function (name, surname, gender, email, password) {
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.email = email;
        this.password = password;
    };

    var allUsers = lStorage.load("allUsers");
    if (allUsers == null) allUsers = {};
    // AF that create new user with input values and return initialized user object
    var createNewUser = function () {
        var name = getValue("nametxt");
        var sname = getValue("surname");
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var email = getValue("useremail");
        var pass = getValue("psword");
        return new User(name, sname, gender, email, pass);
    };

    //  AF that add new user(JS) with email value(or JMBG for example) to allUsers- NEW OBJECT is created by new email field value
    var addNewUserToAllUsers = function (emailProperty) {
        //check if exist some object for this property (email)
        if (!allUsers[emailProperty]) {
            console.log('All users before', allUsers);

            //create new object for this property in allUsers object
            allUsers[emailProperty] = createNewUser();
            //return updated allUser
            return allUsers;
        } else {
            console.log("this email already exists in db");
        }
    };

    // AF that register new user, by creating user then add it to allUser variable. 
    //Then that allUsers saves in local storage, then shows logIn and hides register form.
    var registerNewUser = function () {
        createNewUser();//with all input data
        addNewUserToAllUsers(getValue("useremail"));

        lStorage.save("allUsers", allUsers);
        showElem("logIn");
        hideElem("register");
    };
    //AF that validates input password for input email, for login form
    var validatePasswordForEmail = function (eml, pass) {
        if (allUsers[eml].password == pass) {
            return true;
        }
        return false;
    };
    //AF that presents loged user name and surname in welcome div
    var fillWelcomeDiv = function () {
        var welcome = document.getElementById("welcomeDiv");
        var fullnameLogedInUser;

        if (typeof logedInUser.name != 'undefined') {
            fullnameLogedInUser = logedInUser.name + ' ' + logedInUser.surname;
            welcome.innerHTML = "Welcome : " + fullnameLogedInUser;
        } else {
            welcome.innerHTML = "Welcome stranger, please logIn.";
        }
    };
    fillWelcomeDiv();

    // AF that presents logging:
    var loggingInFunction = function () {
        //reload new logedInUser from local storage 
        location.reload();
        //take email and pass
        var email = getValue("eml");
        var pass = getValue("pass");
        //does user exist with these values?  
        if (typeof allUsers[email] != 'undefined' && validatePasswordForEmail(email, pass) == true) {
            //new js object save in new ls object(logedInUser)
            lStorage.save("logedInUser", allUsers[email]);

            showElem("logOut");
            hideElem("logIn");
        } else {
            console.log('Wrong email or password');
        }
    };

    // AF that presents logging out:
    var loggingOutFunction = function () {
        lStorage.delete('logedInUser');
        location.reload();
        fillWelcomeDiv();
        showElem('logIn');
        hideElem('logOut');
    };

    //  AF that show forget form and hide logIn
    var showForgetHideLogIn = function () {
        showElem("forgetPassword");
        hideElem('logIn');
    };

    //  AF that get input email value and for this email logs password
    var showForgetPassword = function () {
        var femail = getValue("fEmail");
        var forgetPassword = allUsers[femail].password;
        console.log(forgetPassword);
        lStorage.save("fpass", forgetPassword);
        var fpassValue = lStorage.load("fpass");
        alert("Password is:" + fpassValue);
    };
    document.body.addEventListener("load", isSomeUserLoged);

    document.getElementById("regbtn").addEventListener("click", showRegisterHideLogIn);
    document.getElementById("addNewUser").addEventListener("click", registerNewUser);
    document.getElementById("loginbtn").addEventListener("click", loggingInFunction);
    document.getElementById("logOut").addEventListener("click", loggingOutFunction);

    document.getElementById("passbtn").addEventListener("click", showForgetHideLogIn);
    document.getElementById("showPass").addEventListener("click", showForgetPassword);
};
//call Main AF for implement all the functionalities
loginRegistrationForget();

/////////////////////6. Main AF related to films and directors(with all functions)////////////////
var filmsAndDirectors = function () {

    //references to local allFilms and allDirectors
    var allFilms = lStorage.load("allFilms");
    if (allFilms == null) allFilms = {};
    var allDirectors = lStorage.load("allDirectors");
    if (allDirectors == null) allDirectors = {};

    //  ############ DIRECTOR FORM && DIRECTOR LIST ##############

    // AF for show only Add Director form, other forms hided.(instead of DISPLAY:NONE; )
    var showOnlyNewDirectorForm = function () {
        if (isUserLoged) {
            showElem("directorForm"); //show only this form others form hide!!!
            document.getElementById("saveChangesDir").style.visibility = 'hidden';
            hideElem("filmForm");
            hideElem("filmListTable");
            hideElem("directorListTable");
            hideElem("userProfile");
            hideElem("search");
        } else {
            alert("User, please login/register");
        }
    };

    //AF Director object constructor with some ssn
    var Director = function (ssn, name, surname, born, died, nationality) {
        this.ssn = ssn;
        this.name = name;
        this.surname = surname;
        this.born = born;
        this.died = died;
        this.nationality = nationality;
    };

    //AF InitializeDirector with input data; ssn is "123-45-"+ born year and return the instance
    var initializeDirector = function () {
        var name = getValue("directorName");
        var surname = getValue("directorSurname");
        var born = getValue("directorBorn");
        var died = getValue("directorDied");
        var nationality = getValue("nationality");
        var ssn = "123-45-" + born;
        return new Director(ssn, name, surname, born, died, nationality);
    };

    //AF that fills options in #nationality select from some array var
    var fillNationalitySelectList = function () {
        var nationalities = ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'CapeVerdean', 'CentralAfrican', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'CostaRican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dutch', 'EastTimorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'EquatorialGuinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'KittianandNevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'NewZealander', 'Nicaraguan', 'Nigerian', 'Nigerien', 'NorthKorean', 'NorthernIrish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'PapuaNewGuinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'SaintLucian', 'Salvadoran', 'Samoan', 'SanMarinese', 'SaoTomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'SierraLeonean', 'Singaporean', 'Slovakian', 'Slovenian', 'SolomonIslander', 'Somali', 'SouthAfrican', 'SouthKorean', 'Spanish', 'SriLankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian/Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'];
        for (let index = 0; index < nationalities.length; index++) {
            var option = document.createElement("option");
            option.setAttribute("value", nationalities[index]);
            option.textContent = nationalities[index];
            document.getElementById("nationality").appendChild(option);
        }
    };
    fillNationalitySelectList(); //call funtion 

    // AF that addDirectorToAllDirectors if new director doesnt exist in allDirectors with its ssn; and return updated allDirectors
    var addDirectorToAllDirectors = function (ssn) {
        //if such doesnt exist
        if (!allDirectors[ssn]) {
            //initialize dir on given ssn
            allDirectors[ssn] = initializeDirector();
            return allDirectors;
        } else {
            console.log("Such director already exists.");
        }
    };

    //AF for filling directors select list. First removes all options, then gets all keys from allDirectos object,
    // and push director's name and surname to select list
    var fillDirectorSelectList = function () {
        var allDirectorKeys = [];
        //SELECT LIST MUST BE EMPTY- because if we add new director we will call this AF again(DOUBLE DATA) 
        var dirSelect = document.getElementById("directors");
        while (dirSelect.hasChildNodes()) {
            dirSelect.removeChild(dirSelect.firstChild);
        }
        // jQuery is shorter:--->   $("#directors").empty();

        for (var key in allDirectors) {
            allDirectorKeys.push(key);
        }
        for (let index = 0; index < allDirectorKeys.length; index++) {
            var option = document.createElement("option");
            option.setAttribute("value", allDirectors[allDirectorKeys[index]].ssn);
            option.textContent = allDirectors[allDirectorKeys[index]].name + " "
                + allDirectors[allDirectorKeys[index]].surname;
            document.getElementById("directors").appendChild(option);
        }
    }
    fillDirectorSelectList();//a priori fill select list

    //  AF for save new Director; first DONT submit form without next: initialize Director with input data, 
    //add object to allDirectors, allDirectors save to storage.Then reset form and fill 
    var submitNewDirector = function (submitEvent) {
        submitEvent.preventDefault();//hi submit btn, dont submit form without next:
        initializeDirector();
        //define ssn variable for addDirectorToAllDirec(ssn)
        var newSsn = "123-45-" + getValue("directorBorn");
        addDirectorToAllDirectors(newSsn);
        lStorage.save("allDirectors", allDirectors);
        fillDirectorSelectList();
        document.getElementById("directorForm").reset();

    };
    //  #############FILM FORM && FILM LIST ################

    //AF for show only Add Film form, other forms hided.(instead of DISPLAY:NONE; )
    var showOnlyFilmForm = function () {
        if (isUserLoged) {
            showElem("filmForm");
            document.getElementById("saveChangesF").style.visibility = "hidden";
            hideElem("directorForm");
            hideElem("filmListTable");
            hideElem("directorListTable");
            hideElem("userProfile");
            hideElem("search");
        } else {
            alert("User, please login/register");
        }
    };

    //starNumber variable saves value for setting 'rate' property(by clicking on starNodes)

    var starNodes = document.querySelectorAll(".star");
    var starNumber;
    starNodes.forEach(starNode => {
        starNode.addEventListener("click", function () {
            //every star node has a number at 5.index
            starNumber = this.className.charAt(5);

            for (var selectedIndex = 0; selectedIndex < starNodes.length; selectedIndex++) {
                //every node with less index change to yellow(selected node has less index too)
                if (selectedIndex < starNumber) {
                    starNodes[selectedIndex].src = "images/stars/ystar.png";
                } else { //nodes with greater index(after selected)change to white
                    starNodes[selectedIndex].src = "images/stars/wstar.png";
                }
            }
        });
    });

    //  AF Film object contructor
    var Film = function (id, title, director, gender, recordYear, oneDrived, odUsername, watched, rate) {
        this.id = id;
        this.title = title;
        this.director = director;
        this.gender = gender;
        this.recordYear = recordYear;
        this.oneDrived = oneDrived;
        this.odUsername = odUsername;
        this.watched = watched;
        this.rate = rate;
    };
    //  AF initializeFilm
    var initializeFilm = function () {
        var id = getValue("filmId");
        var title = getValue("filmTitle");
        //get select option value
        var dir = document.getElementById("directors");
        var director = dir.options[dir.selectedIndex].value;
        var gen = document.getElementById("gender");
        var gender = gen.options[gen.selectedIndex].value;
        var recordYear = getValue("recordYear");
        //oneDrived true/false and username
        var oneDrived = document.getElementById("oneDrivedYes").checked;
        var odUsername = getValue("odUsername");
        //watched true/false
        var watched = document.getElementById("watchedY").checked;
        var rate = starNumber;
        return new Film(id, title, director, gender, recordYear, oneDrived, odUsername, watched, rate);
    };

    //initialize new film and add to list and return new list.
    var addFilmToAllFilms = function (id) {
        if (!allFilms[id] && document.querySelectorAll("required") != null) {
            allFilms[id] = initializeFilm();
            return allFilms;//return updated list
        } else {
            console.log("such film already exist");
        }
    };
    //add new initilized film to list and localy and reset all fields.
    var submitNewFilm = function (subEvent) {
        subEvent.preventDefault();
        addFilmToAllFilms(getValue("filmId"));//return new list
        //save localy
        lStorage.save("allFilms", allFilms);
        console.log(allFilms);

        document.getElementById("filmForm").reset();
    };
    //  AF that fills select list #gender
    var fillGenders = (function () {
        var genders = ["Pick up gender", "Action", "Adventure", "Comedy", "Crime&Gangster", "Drama", "Epics/Historical", "Horror", "Musicals/Dance", "Science Fiction", "War", "Westerns"];
        for (let index = 0; index < genders.length; index++) {
            var option = document.createElement("option");
            if (genders[index] == "Pick up gender") {
                option.setAttribute("value", "");
            }
            option.setAttribute("value", genders[index]);
            option.textContent = genders[index];
            document.getElementById("gender").appendChild(option);
        }
    })();   //a priori fill genders select list

    //oneDrived named radio btns show/hide #oneDrive in eventListener function, on click event
    var oneDrivedRbs = document.querySelectorAll('input[name="oneDrived"]');
    oneDrivedRbs.forEach(oneDrivedRb => {
        oneDrivedRb.addEventListener("click", function () {
            if (oneDrivedRb.id == "oneDrivedYes") {
                showElem("oneDrive");
            } else {
                hideElem("oneDrive");
            }
        });
    });
    // watched named radio btns show/hide #yesWatch in eventListener function, on click event
    var watchRadioButtons = document.querySelectorAll('input[name="watched"]');
    watchRadioButtons.forEach(radioBtn => {
        radioBtn.addEventListener("click", function () {
            if (radioBtn.id =="watchedY") {
                showElem("yesWatch");
            } else {
                hideElem("yesWatch");
            }
        });
    });
    var addNewDirectorForm = function () {
        showElem("directorForm");
    };

    document.getElementById("addNewFilm").addEventListener("click", showOnlyFilmForm);
    document.getElementById("addNewDirector").addEventListener("click", showOnlyNewDirectorForm);
    document.getElementById("saveNewDirector").addEventListener("click", submitNewDirector);
    document.getElementById("addNewDir").addEventListener("click", addNewDirectorForm);
    document.getElementById("addFilm").addEventListener("click", submitNewFilm);

    return {
        initDirector: initializeDirector,
        initFilm: initializeFilm,
        addFilmToAllFilms: addFilmToAllFilms,
        fillDirSelect: fillDirectorSelectList
    }
};
//call to execute with all inner functions
//filmsAndDirectors();

//8. Variable to save reference on Main AF related to films and directors
var filmsAndDirectorsRef = filmsAndDirectors();

// 9. AF related to film list table.............................
var filmsTable = (function () {
    // AF that create and return table with id, jqueryClass and numberOfColumns within #filmListTable.
    var createThead = function (id, jqClass, colsNum) {
        //table parent element
        var table = document.createElement("table");
        table.setAttribute("id", id);
        table.setAttribute("class", jqClass);
        //thead
        var thead = document.createElement("thead");
        thead.setAttribute("id", "theadFilms");
        thead.setAttribute("style", "background:gray;");
        var theadtr = document.createElement("tr");
        theadtr.setAttribute("id", "theadtr");

        for (var i = 0; i < colsNum; i++) {
            var th = document.createElement("th");
            theadtr.appendChild(th);
        }
        thead.appendChild(theadtr);
        table.appendChild(thead);
        //tbody
        var tbody = document.createElement("tbody");
        tbody.setAttribute("id", "tbodyFilms");
        var tr = document.createElement("tr");
        for (var i = 0; i < colsNum; i++) {
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        //append table to html
        document.getElementById("filmListTable").appendChild(table);
    };

    var writeThead = function (dataArray) {
        var theadtrArray = document.getElementById("theadtr").childNodes;
        for (var i = 0; i < theadtrArray.length; i++) {
            theadtrArray[i].textContent = dataArray[i];
        }
    };

    var writeTbody = function () {
        var filmsBody = document.getElementById("tbodyFilms");
        // thead>tr>th-count is the column number in tbody
        var cols = document.getElementById("theadtr").childNodes;
        for (var filmID in allFilms) {
            //allFilms[filmID] is film object 
            var tr = document.createElement("tr");

            for (var prop in allFilms[filmID]) {
                var td = document.createElement("td");
                //multiple TERNARY operator
                td.textContent = allFilms[filmID][prop] === "" ? "None"
                    : td.textContent = allFilms[filmID][prop] === false ? "No"
                        : td.textContent = allFilms[filmID][prop] === true ? "Yes"
                            : allFilms[filmID][prop];
                tr.appendChild(td);//add first,second td in tr   
            }

            var edit = document.createElement("button");
            edit.setAttribute("id", filmID + "_edit");
            edit.textContent = "edit";
            tr.appendChild(edit);

            var del = document.createElement("button");
            del.setAttribute("id", filmID + "_del");
            del.textContent = "del";
            tr.appendChild(del);

            filmsBody.appendChild(tr);
        }
    };

    return {
        createHead: createThead,//property for variable that save value for function
        writeHead: writeThead,
        writeBody: writeTbody
    }
})();

filmsTable.createHead("fTable", "tableSorter", 10);
filmsTable.writeHead(["Id", "Title", "Director", "Gender", "Recorded", "OneDrived", "Username", "Watched", "Rate", "Edit / Delete"]);
filmsTable.writeBody();

//call in edit/del
var refreshFilmsTable = function () {
    var fbody = document.getElementById("tbodyFilms");
    while (fbody.hasChildNodes()) {
        fbody.removeChild(fbody.firstChild); //remove rows
    }// $("#tbodyFilms").empty() .................JQUERY substitution

    allFilms = lStorage.load("allFilms");//load from lstorage again and write its data
    filmsTable.writeBody(); //write body from storage
};

var showOnlyFilmListTable = function () {
    if (isUserLoged) {
        showElem("filmListTable");
        hideElem("filmForm");
        hideElem("directorForm");
        hideElem("directorListTable");
        hideElem("userProfile");
        hideElem("search");
    } else {
        console.log("user, please login or register");

    }
};

document.getElementById("filmList").addEventListener("click", showOnlyFilmListTable);

// 10. AF related to directors list table.............................
var directorsListTable = (function () {

    var createThead = function (id, jqClass, cols) {
        var table = document.createElement("table");
        table.setAttribute("id", "dirTable");

        var thead = document.createElement("thead");
        thead.setAttribute("id", id);
        var tr = document.createElement("tr");
        tr.setAttribute("id", "dir_theadtr");
        tr.setAttribute("style", "background:grey;")

        for (var i = 0; i < cols; i++) {
            var th = document.createElement("th");
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);

        var tbody = document.createElement("tbody");
        tbody.setAttribute("id", "dir_tbody");
        table.appendChild(tbody);

        document.getElementById("directorListTable").appendChild(table);
    };
    var writeThead = function (dataArray) {
        var thList = document.getElementById("dir_theadtr").childNodes;
        for (var i = 0; i < thList.length; i++) {
            thList[i].textContent = dataArray[i];
        }
    };
    var writeTbody = function () {
        var dirTbody = document.getElementById("dir_tbody");

        for (var ssnProperty in allDirectors) {
            var newtr = document.createElement("tr");

            for (var objProp in allDirectors[ssnProperty]) {
                var newTd = document.createElement('td');
                newTd.textContent = allDirectors[ssnProperty][objProp] == "" ? "No" : allDirectors[ssnProperty][objProp];
                newtr.appendChild(newTd);
            }//filled one tr
            var edit = document.createElement("button");
            edit.setAttribute("id", "edit-"+ssnProperty);
            edit.textContent = "edit";
            newtr.appendChild(edit);

            var del = document.createElement("button");
            del.setAttribute("id", "del-"+ssnProperty);
            del.textContent = "del";
            newtr.appendChild(del);

            dirTbody.appendChild(newtr);
        }
    };
    return {
        createHead: createThead,
        writeHead: writeThead,
        writeBody: writeTbody
    }
})();

directorsListTable.createHead("dirThead", "tableSorter", 7);
directorsListTable.writeHead(["ssn", "Name", "Surname", "Born", "Died", "Nationality", "Edit/Delete"]);
directorsListTable.writeBody();

var refreshDirectorsTable = function () {
    var dirTbody = document.getElementById("dir_tbody");
    while (dirTbody.hasChildNodes()) {
        dirTbody.removeChild(dirTbody.firstChild);
    }//all childs removed
    allDirectors = lStorage.load('allDirectors');
    directorsListTable.writeBody();
};

var showOnlyDirectorsTable = function () {
    if (isUserLoged) {
        showElem("directorListTable");
        hideElem("filmForm");
        hideElem("directorForm");
        hideElem("filmListTable");
        hideElem("userProfile");
        hideElem("search");
    }
}
document.getElementById("directorList").addEventListener("click", showOnlyDirectorsTable);


// window.onload = function () {
//     var appCache = window.applicationCache;
//     appCache.oncached = function (e) { console.log("cache successfully downloaded"); }; }

// # AF(assigned to var demoData), with json data in 3 vars, that saves these vars in lStorage vars
var demoData = function () {
    var demoUsers = {
        "zex.s@gmail.com": {
            "name": "Zeljko",
            "surname": "Sokolovic",
            "gender": "male",
            "email": "zex.s@gmail.com",
            "password": "12345"
        },
        "srecko.s@gmail.com": {
            "name": "Srecko",
            "surname": "Sokolovic",
            "gender": "female",
            "email": "srecko.s@gmail.com",
            "password": "67890"
        }
    }
    var demoFilms = {
        "100200": {
            "id": "100200",
            "title": "Unforgiven",
            "director": "Clint Eastwood",
            "gender": "western",
            "recordYear": "1992",
            "oneDrived": false,
            "odUsername": "",
            "watched": true,
            "rate": "4"
        },
        "100201": {
            "id": "100201",
            "title": "Vicky Christina Barselona",
            "director": "Woody Alen",
            "gender": "drama",
            "recordYear": "2008",
            "oneDrived": true,
            "odUsername": "zex@ever.com",
            "watched": true,
            "rate": "4"
        },
        "100202": {
            "id": "100203",
            "title": "Titanic",
            "director": "James Cameron",
            "gender": "drama",
            "recordYear": "1997",
            "oneDrived": false,
            "odUsername": "",
            "watched": false,
            "rate": ""
        }
    }
    var demoDirectors = {
        "123-45-1930": {
            "ssn": "123-45-1930",
            "name": "Clint",
            "surname": "Eastwood",
            "born": "1930",
            "died": "",
            "nationality": "USA"
        },
        "123-45-1935": {
            "ssn": "123-45-1935",
            "name": "Woody",
            "surname": "Alen",
            "born": "1935",
            "died": "",
            "nationality": "USA"
        },
        "123-45-1954": {
            "ssn": "123-45-1954",
            "name": "James",
            "surname": "Cameroon",
            "born": "1954",
            "died": "",
            "nationality": "Canadian"
        }
    }
    // json data saved in Local storage variables.........................LOCAL STORAGE
    lStorage.save('allUsers', demoUsers);
    lStorage.save('allFilms', demoFilms);
    lStorage.save('allDirectors', demoDirectors);
};
demoData(); // Call anonimous function to store json in local storage

//   11. AF -Edit/delete  AFTER DEMO DATA!!!!!!!!!!
var editAndDelete = (function () {
    //add button on filmForm
    var saveChangesF = document.createElement("button");
    saveChangesF.setAttribute("id", "saveChangesF");
    saveChangesF.setAttribute("type", "submit");
    saveChangesF.textContent = "Save changes";
    document.getElementById("filmButtons").appendChild(saveChangesF);

        var saveChangedFilmInLS = function (filmID) {
            if (allFilms[filmID].id == getValue('filmId') && document.querySelectorAll("require") != null) {
                allFilms[filmID] = filmsAndDirectorsRef.initFilm();//change one film object
            } else {
                console.log('There is no film for that id and you must fill all required fields!');
            }
            lStorage.save('allFilms', allFilms);//in ls in 'allFilms' SAVE this changed jsObject allFilms  
        };
    //  EDIT FILM..........................................
    var editFilm = function (filmID) {
      
        showElem("filmForm");
        document.getElementById("saveChangesF").style.visibility = "visible";
        //selected film object fill FORM 
        setValue("filmId",allFilms[filmID].id);
        setValue("filmTitle",allFilms[filmID].title);
        setValue("directors",allFilms[filmID].director);
        setValue("gender", allFilms[filmID].gender);
        setValue("recordYear",allFilms[filmID].recordYear);
        setValue("oneDrivedYes",allFilms[filmID].oneDrived);
        setValue("odUsername",allFilms[filmID].odUsername);
        setValue("watchedY",allFilms[filmID].watched);
        //click on save changes
          document.getElementById("saveChangesF").addEventListener("click",function (clickEvent) {

              clickEvent.preventDefault();//dont submit whole form data until check
              saveChangedFilmInLS(filmID);
              refreshFilmsTable();
              hideElem('filmForm');
              showElem('filmListTable');
              showElem("fTable")
          });
    };

    var allEditFilmBtns = document.querySelectorAll("button[id$='_edit']");     //Attribute selector !!!
    allEditFilmBtns.forEach(btnElement => {
        btnElement.addEventListener('click',function (clickEvent) {
            if(clickEvent.target.id.endsWith('_edit')){
                editFilm(clickEvent.target.id.split('_edit')[0]);
            }
        });
    });
    
    var editDir = document.createElement("button");
    editDir.setAttribute("id","saveChangesDir");
    editDir.setAttribute("type","submit");
    editDir.textContent = "Save changes";
    document.getElementById("directorButtons").appendChild(editDir);
        
        var saveChangedDirectorInLS = function (id) {
            //validation check without ID check
            if(document.querySelectorAll("require") != null){
            allDirectors[id] = filmsAndDirectorsRef.initDirector();//change current director
            } else {
                console.log('there is no director for this id and fill required fields');
            }
            // update allDirectors
            lStorage.save('allDirectors',allDirectors);
        };

    //  EDIT DIRECTOR.............................................
    var editDirector = function (id) {
        showElem('directorForm');
        document.getElementById("saveChangesDir").style.visibility = 'visible';
        //      1.  fill form fields
        setValue('directorName',allDirectors[id].name);
        setValue('directorSurname',allDirectors[id].surname);
        setValue('directorBorn',allDirectors[id].born);
        setValue('directorDied',allDirectors[id].died);
        setValue('nationality',allDirectors[id].nationality);
        //click on button
        document.getElementById("saveChangesDir").addEventListener('click',function (clickEv) {
            clickEv.preventDefault();//dont submit for now
            filmsAndDirectorsRef.fillDirSelect(); //update select list
            //  2. after filling form save changed director
            saveChangedDirectorInLS(id);
            refreshDirectorsTable();
            showElem('dirTable');
            hideElem('directorForm');
        });
    };
    var editDirButtons = document.querySelectorAll("button[id^='edit']");
    editDirButtons.forEach(element => {
        element.addEventListener('click',function (clickEv) {
            if(clickEv.target.id.startsWith('edit-')){
                editDirector(clickEv.target.id.split('edit-')[1]);
            }
        })
    });

    //  call DELETE film/director
    var deleteFilmOrDirector = (function () {
      
        var deleteFilm = function (id) {
          var films = lStorage.load('allFilms');
          delete films[id];
          lStorage.save('allFilms', films);
          refreshFilmsTable();
          showElem('fTable');
        };

        var deleteDirector = function (id) {
            var allDirs = lStorage.load('allDirectors');
            delete allDirs[id];
            lStorage.save('allDirectors',allDirs);
            refreshDirectorsTable();
            showElem('dirTable');
        };

        var allDelButtonsF = document.querySelectorAll('button[id$="_del"]');
        allDelButtonsF.forEach(element => {
            element.addEventListener('click',function (e) {
                if(e.target.id.endsWith('_del')){
                    deleteFilm(e.target.id.split('_del')[0]);
                }
            });
        });

        var allDelButtonsD = document.querySelectorAll('button[id^="del-"]');
        allDelButtonsD.forEach(element => {
            element.addEventListener('click',function (e) {
                if(e.target.id.startsWith('del-')){
                    deleteDirector(e.target.id.split('del-')[1]);
                }
            });
        });
    })();
    
    return {
        editFilm: editFilm, 
        editDirector: editDirector,
        deleteFilmOrDirector: deleteFilmOrDirector
    }
})();

//profile page
var userInformation = function () {
    if(isUserLoged){
        var logedUser = lStorage.load('logedInUser');
        document.getElementById("userName").textContent = " " + logedUser.name;
        document.getElementById("userSurname").textContent =" "+ logedUser.surname;
        document.getElementById("userGender").textContent = " "+ logedUser.gender;
        document.getElementById("userEmail").textContent = " "+ logedUser.email;
        showElem('userProfile');
        hideElem('filmForm');
        hideElem('directorForm');
        hideElem('filmListTable');
        hideElem('directorListTable');
        hideElem('search');
    } else {
        console.log('please log in!');
        
    }    
};
document.getElementById("userinfo").addEventListener('click', userInformation);

//search
var search = function () {
    var searchText  = document.getElementById("searchTxt").value;
    var findFilm = false;
    hideElem('noFilm');
    var resultsDiv = document.getElementById("resultsDiv");
    
    while(resultsDiv.hasChildNodes()){
        resultsDiv.removeChild(resultsDiv.firstChild);
    } //$('#searchTbody tr').remove();

    var resultTable = document.createElement("table");
    var thead = document.createElement("thead");
    var tr=document.createElement("tr");
    var array  = ["Id", "Title", "Director", "Gender", "Recorded", "OneDrived", "Username", "Watched", "Rate"];
    for(var i in array){
        var th=document.createElement("th");
        th.setAttribute('style','background:grey;');
        th.textContent = array[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    resultTable.appendChild(thead);

    for(var filmID in allFilms){
        var titleAndDirector = allFilms[filmID].title+allFilms[filmID].director;

        if(titleAndDirector.indexOf(searchText)!= -1){
            var tbody=document.createElement("tbody");
            var trBody=document.createElement("tr");
            for (var prop in allFilms[filmID]) {
                var td=document.createElement("td");
                td.textContent = allFilms[filmID][prop] === "" ? "None"
                    : td.textContent = allFilms[filmID][prop] === false ? "No"
                        : td.textContent = allFilms[filmID][prop] === true ? "Yes"
                            : allFilms[filmID][prop];
                trBody.appendChild(td);
            }
            tbody.appendChild(trBody);
            resultTable.appendChild(tbody);
           
            findFilm = true;
        } 
    }

    resultsDiv.appendChild(resultTable);
    //check findFilm at the end
    if(findFilm == false) showElem('noFilm');
};
document.getElementById("searchDivBtn").addEventListener('click',search);

var showSearch = function () {
  if(isUserLoged){
      showElem('search');
      showElem('filmListTable');
      showElem('fTable');
      hideElem('noFilm');
      hideElem('filmForm');
      hideElem('directorForm');
      hideElem('filmListTable');
      hideElem('directorListTable');
      hideElem('userProfile');
  }  
};
document.getElementById("searchMenu").addEventListener('click',showSearch);
