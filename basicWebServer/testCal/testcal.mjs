import { expect } from 'chai';
import calculator from '../calculator/cal.js';

describe("Test Calculator Functionality ...", () => {
    describe("Test Additional Functionality ...", () => {
        it("2 + 2 should be equals to 4", () => {
            expect(calculator.addition(2, 2)).to.equal(4);
        });
        it("should add two numbers", () => {
            expect(calculator.addition(23, 25)).to.equal(48);
            expect(calculator.addition(-23, 25)).to.equal(2);
            expect(calculator.addition(200000, 200000)).to.equal(400000);
        });
    });
    describe("Test division Functionality ...", () => {
        it("should divide two numbers", () => {
            expect(calculator.division(6, 2)).to.equal(3);
            expect(calculator.division(20, 4)).to.equal(5);
            expect(calculator.division(25, 2)).to.equal(12.5);
        });
        it("should return undefined if zero division", () => {
            expect(calculator.division(6, 0)).to.be.undefined;
            expect(calculator.division(20, 0)).to.be.undefined;
            expect(calculator.division(25, 0)).to.be.undefined;
        });
    });
});