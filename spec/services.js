'use strict';

require('should');
var sinon = require('sinon');

describe('services', function() {
  describe('authService', function() {
    var authService = require('../angular-local-storage-service.js');

    it('should have a configure function', function() {
      authService.configure.should.be.a.Function;
    });

    it('should have an isAuthenticated function', function() {
      authService.isAuthenticated.should.be.an.Function;
    });

    it('should have a loginConfirmed function', function() {
      authService.loginConfirmed.should.be.an.Function;
    });

    it('should have a loginRequired function', function() {
      authService.loginRequired.should.be.an.Function;
    });

    it('should have a logoutConfirmed function', function() {
      authService.logoutConfirmed.should.be.an.Function;
    });

    it('should have a allowed function', function() {
      authService.allowed.should.be.an.Function;
    });

    it('should have a profile function', function() {
      authService.profile.should.be.an.Function;
    });

    it('should be able to create a new lead object', function() {
      var mailSpy = { send: sinon.spy() };
      var dataSpy = { Customer: { createLead: sinon.spy() } };
      var profile = 'foo';

      CRM.lead.create({mail: mailSpy, data: dataSpy}, profile);
      mailSpy.send.calledOnce.should.be.true;
      dataSpy.Customer.createLead.calledOnce.should.be.true;
    });
  });
});