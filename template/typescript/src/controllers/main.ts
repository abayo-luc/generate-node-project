/**
 * @description a dummy class to showcase how controllers should structured
 * @class Main
 */
class MainController {
  /**
   * @author Whomever
   * @param {any} req
   * @param {object} res
   * @returns {Object} Returns an object
   */
  static home(req: any, res: any) {
    res.status(200).json({ message: "Hey! You made it." });
  }
}

export default MainController;
