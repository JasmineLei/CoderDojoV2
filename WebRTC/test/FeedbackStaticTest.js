
var io = require('socket.io-client');

var ninjaSocket;

  
var WebdriverIO = require('webdriverio'),
     browserB = WebdriverIO.remote({ desiredCapabilities: {browserName: 'firefox'}});
 
     
var should = require('should');
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
 
    chai.use(chaiAsPromised);
    expect = chai.expect;
    chai.Should();
    chaiAsPromised.transferPromiseness = browserB.transferPromiseness;



describe('test mentor static feedback', function() {
    
    //this.timeout = 99999999;
    before(function() {
		
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
	});
    after(function() {
		ninjaSocket.disconnect();
	});
    it('should open chat application', function() {
        browserB.init().windowHandleSize({width: 1000, height: 800})
                        .url('https://localhost:8000/sign_in?url=%2FMentor')
                        .then(function(){
                            ninjaSocket.emit('iceRequest', {mentor:'Test Ninja'});
                        })
                        .pause(1000);
        //return browserB.init().url('http://webdriver.io');
    });

    it('should fill email and password and login as mentor', function() {
        browserB.setValue('#email', 'jj')
                        .setValue('#password', '123')
                        .click('.btn').pause(1000)
                        .getTitle().should.eventually.equal('Mentor Toolbar')
                        .pause(2000);  
             
    });
    
    it('ninja should request', function() {
			
			browserB.pause(1000).then(function(){
                        
                        ninjaSocket.emit('requestHelp');
                    }).pause(1000)
                    .getHTML('#helpQueue .btn',false).should.eventually.to.exist;
	});
    
    it('mentor should answer', function() {
			browserB.click('#helpQueue .btn').pause(1000)
                           .getHTML('#headingThree h4 a',false).should.eventually.equal('Chats')
                           .pause(1000);
	});
    
    it('should add video', function() {
            
			browserB.pause(1000).then(function(){
                ninjaSocket.emit('test_addVideo');
            })
            .getHTML('#ninjaScreen',false).should.eventually.to.exist
            .pause(1000);
	});
    
    it('should take screenshot', function() {
            
            browserB.pause(1000)
                            
                           .click('#takescreenShot').pause(1000)
                            .isVisible('#myCanvas').then(function(isVisible) {
                              isVisible.should.equal(true);
                            }) 
                            .pause(2000)
                         
	});
    
    
    
    
    it('should cancel current screenshot and take a new one', function() {

        browserB.click('#closeCanvas').pause(1000)
                        .isVisible('#myCanvas').then(function(isVisible) {
                            isVisible.should.equal(false);
                        }) 
                        .click('#takescreenShot').pause(1000)
                        .isVisible('#myCanvas').then(function(isVisible) {
                            isVisible.should.equal(true);
                        })
                        .pause(3000);  
	});
    
    it('should highlight screenshot', function() {
        ninjaSocket.emit('test_highlight');
        browserB.pause(1000)
                       .getAttribute('#myCanvas', 'textContent').then(function(txtContent) {
                            txtContent.should.equal('changed'); 
                        })
                        .pause(3000);
    });
    it('should send out image', function() {

        function test(data){
            data.should.have.property('image');
            data.should.have.property('name');
            //console.log(data);
        }
        browserB.click('#sendscreenShot').pause(2000)
                       .isExisting('img.fancybox').then(function(isExisting) {
                          isExisting.should.equal(true); 
                         })
                         .pause(2000);  
                         
        ninjaSocket.once('screenshot',test);
        browserB.pause(1000);
	});
    
    it('should sign out', function() {
        
         browserB.click('#signOut')
                        .pause(2000);
	});

    it('should end the session', function() {
        browserB.pause(2000).end();
    });

});
