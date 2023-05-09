const testMode=true ;

function lsTest() {
    var test = "test";
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// local storage available  

// define SCORM event constants --  !! do not change !!
window.SCORM_SET_DATA = "SCORM_SET_DATA";
window.SCORM_SET_STATUS = "SCORM_SET_STATUS";
window.SCORM_SET_COMPLETION="SCORM_SET_CONSTANTS"

// main handler for scorm operations
window.SCORM_HANDLER = {
    SCORM: pipwerks.SCORM,
    startTime: new Date().getTime(),
    hasLS: lsTest(),
    KEY_SUSPEND_DATA: "cmi.suspend_data", // change if needed
    KEY_LESSON_STATUS: "cmi.completion_status",//"cmi.lesson_status", // change if needed
    KEY_COMPLETION_STATUS: "cmi.success_status",

    init: function() {
        console.log("DEBUG: starting scorm handler");
        this.SCORM.version = "2004";
        this.SCORM.connection.initialize();

        if (!this.SCORM.connection.isActive && !this.hasLS) {
            alert(
                "No LMS found for SCORM and Local Storage is not supported on this browser (for IE11 & Edge this is only locally). Information will only be stored until refresh"
            );
        }

        this.registerEvents();
    },

    registerEvents: function() {
        document.addEventListener(
            window.SCORM_SET_DATA,
            this.setDataHandler.bind(this)
        );

        document.addEventListener(
            window.SCORM_SET_STATUS,
            this.setStatusHandler.bind(this)
        );

        window.addEventListener("unload", this.windowUnloadHandler.bind(this));
    },
    setSimpleData:function(data){
        this._scormSet(this.KEY_SUSPEND_DATA, data);
        this.SCORM.save();
    },
    setSuspendData: function(gameStatus, user) {
        //console.log("SET SUSPEND DATA",gameStatus,user);
        //this.setLessonStatus("incomplete");
        this.updateSessionTime();
        var data = this.getSuspendData() || {};
        data.gameStatus = gameStatus || data.gameStatus;
        //console.log(data.gameStatus)
        data.user = user || data.user;
        data = JSON.stringify(data);
        //console.log("JSON",data);
        this._scormSet(this.KEY_SUSPEND_DATA, data);
        this.SCORM.save();
    },

    updateSessionTime: function() {
        var newD=Math.floor((new Date().getTime() - this.startTime)/10)
        //console.log("TIME SCORM :",this._centisecsToISODuration(newD));
        this.SCORM.set(
            "cmi.session_time",
            this._centisecsToISODuration(newD)
        );
    },

    getSuspendData: function() {
        var suspendData = this._scormGet(this.KEY_SUSPEND_DATA);
        //console.log("FUNCTION SUSPEND DATA",suspendData)
        return suspendData;
    },
    getStatus:function(){
        var lessonStatus=this._scormGet(this.KEY_LESSON_STATUS);
        //this.SCORM.data.completionStatus=lessonStatus
        return lessonStatus;
    },
    setLessonStatus: function(status) {
        //this.SCORM.data.completionStatus=status;
        this.SCORM.set(this.KEY_LESSON_STATUS, status);
    },
    setSucessStatus:function(status){
        this.SCORM.set(this.KEY_COMPLETION_STATUS,status);
    },
    setScore:function(score){
        this.SCORM.set('cmi.score.min', '0');
        this.SCORM.set('cmi.score.max', '100');
        this.SCORM.set('cmi.score.raw', ''+score+'');
        this.SCORM.set('cmi.score.scaled', ''+(score/100)+'');
    },
    _scormGet: function(name) {
        var data;
        if (this.SCORM.connection.isActive) {
            data = this.SCORM.get(name);
        } else if (this.hasLS & !testMode) {
            data = window.localStorage.getItem(name);
            //console.log("DATA GET", name, data)
        } else {
            // no data saved
            data = null;
        }
        return data ? JSON.parse(data) : null;
    },

    _scormSet: function(name, data) {
        if (this.SCORM.connection.isActive) {
            this.SCORM.set(name, data);
        } else if (this.hasLS & !testMode) {
            //console.log("DATA SET : ",name,data)
            window.localStorage.setItem(name, data);
        } else {
            // no saving of data
        }
    },

    clearData: function() {
        this._scormSet(this.KEY_SUSPEND_DATA, null);
        this._scormSet(this.KEY_LESSON_STATUS, "incomplete");
    },

    setStatusHandler: function(evt) {
        // event detail will include status string
        this.setLessonStatus(evt.detail.status);
    },

    setDataHandler: function(evt) {
        // event detail will include gameStatus object
        var suspendData = evt.detail.gameStatus;
        this.setSuspendData(suspendData);
    },
    windowUnloadHandler: function() {
        this.updateSessionTime();
        if (this.SCORM.connection.isActive) {
            this.SCORM.quit();
        }
    },
    _centisecsToISODuration: function(n) { 
       // Note: SCORM and IEEE 1484.11.1 require centisec precision 
        // Months calculated by approximation based on average number 
        // of days over 4 years (365*4+1), not counting the extra day 
        // every 1000 years. If a reference date was available, 
        // the calculation could be more precise, but becomes complex, 
        // since the exact result depends on where the reference date 
        // falls within the period (e.g. beginning, end or ???) 
        // 1 year ~ (365*4+1)/4*60*60*24*100 = 3155760000 centiseconds 
        // 1 month ~ (365*4+1)/48*60*60*24*100 = 262980000 centiseconds 
        // 1 day = 8640000 centiseconds 
        // 1 hour = 360000 centiseconds 
        // 1 minute = 6000 centiseconds 
        n = Math.max(n,0); // there is no such thing as a negative duration 
        var str = "P"; 
        var nCs = n; 
        // Next set of operations uses whole seconds 
        var nY = Math.floor(nCs / 3155760000); 
        nCs -= nY * 3155760000; 
        var nM = Math.floor(nCs / 262980000); 
        nCs -= nM * 262980000; 
        var nD = Math.floor(nCs / 8640000); 
        nCs -= nD * 8640000; 
        var nH = Math.floor(nCs / 360000); 
        nCs -= nH * 360000; 
        var nMin = Math.floor(nCs /6000); 
        nCs -= nMin * 6000 
        // Now we can construct string 
        if (nY > 0) str += nY + "Y"; 
        if (nM > 0) str += nM + "M"; 
        if (nD > 0) str += nD + "D"; 
        if ((nH > 0) || (nMin > 0) || (nCs > 0)) { 
            str += "T"; 
            if (nH > 0) str += nH + "H"; 
            if (nMin > 0) str += nMin + "M"; 
                    if (nCs > 0) str += (nCs / 100) + "S"; 
        } 
        if (str == "P") str = "PT0H0M0S"; 
          // technically PT0S should do but SCORM test suite assumes longer form. 
        return str;  
    } 
};

window.SCORM_HANDLER.init();

