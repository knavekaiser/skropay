import { Header, Footer } from "./Elements";
import { Link } from "react-router-dom";

const CopyrightPolicy = () => {
  return (
    <div className="generic copyPolicy">
      <Header />
      <div className="content">
        <h1>Copyright Policy</h1>
        <section>
          <h3>COPYRIGHT INFRINGEMENT POLICY</h3>
          <p>
            DeliveryPay respects the intellectual property rights of others. If
            you believe that your work has been copied in a way that constitutes
            copyright infringement, please provide DeliveryPay's Copyright Agent
            with the information specified below in the form of a "Notification
            of Alleged Infringement." It is DeliveryPay's policy to respond to
            clear Notifications of Alleged Infringement, and our policy is
            designed to make submitting Notifications of Alleged Infringement as
            straightforward as possible while reducing the number of
            Notifications that we receive that are fraudulent or difficult to
            understand or verify.
          </p>
          <p>
            If you are a User (as defined in the User Agreement at{" "}
            <Link to="/terms">https://www.DeliveryPay.in/terms</Link>) or
            subscriber and concerned about the removal of or blocked access to
            your content, please provide DeliveryPay's Copyright Agent with the
            written information specified below in the form of a
            "Counter-Notification." The forms specified below are consistent
            with the forms suggested by the United States Digital Millennium
            Copyright Act (the text of which can be found at the U.S. Copyright
            Office Website at{" "}
            <a href="http://www.copyright.gov">http://www.copyright.gov</a>).
          </p>
        </section>
        <section>
          <h3>DMCA NOTIFICATION OF ALLEGED COPYRIGHT INFRINGEMENT</h3>
          <p>
            If you would like to submit a claim of copyright infringement for
            material, please substantiate each claim by sending DeliveryPay's
            registered Copyright Agent a Notification of Claimed Infringement at
            the email or mailing address below:
          </p>
          <ul>
            <li>
              Copyright Agent c/o DeliveryPay, C2, Sector 1 , Noida -201301
            </li>
            <li>
              <a href="mailto:copyright@DeliveryPay.in">
                copyright@DeliveryPay.in
              </a>
            </li>
          </ul>
          <p>
            To be considered effective, a Notification of Alleged Infringement
            must be submitted in writing and include the following information:
          </p>
          <ul>
            <li>
              To be considered effective, a Notification of Alleged Infringement
              must be submitted in writing and include the following
              information:
            </li>
            <li>
              Physical or electronic signature of the owner, or a person
              authorized to act on behalf of the owner, of an exclusive
              copyright that has allegedly been infringed
            </li>
            <li>
              Identification of the copyrighted material claimed to have been
              infringed
            </li>
            <li>
              Identification of the material that is claimed to be infringing or
              to be the subject of infringing activity that is to be removed or
              access to which is to be disabled
            </li>
            <li>
              Information reasonably sufficient to permit DeliveryPay to locate
              the material that is claimed to be infringing or to be the subject
              of infringing activity
            </li>
            <li>
              Information reasonably sufficient to permit DeliveryPay to contact
              person submitting the Notification, such as a physical address,
              email address, and telephone number
            </li>
            <li>
              A statement that the person submitting the Notification has a good
              faith belief that use of the material in the manner complained of
              is not authorized by the copyright owner, its agent, or the law
            </li>
            <li>
              A statement that the information in the Notification is accurate,
              and under penalty of perjury, that the person submitting the
              Notification is authorized to act on behalf of the owner of an
              exclusive right that is allegedly infringed
            </li>
          </ul>
        </section>
        <section>
          <h3>DMCA COUNTER-NOTIFICATION</h3>
          <p>
            If you elect to send us a Counter-Notification, please send an email
            or letter to DeliveryPay's registered Copyright Agent at the email
            or mailing address below:
          </p>
          <ul>
            <li>
              Copyright Agent c/o DeliveryPay, C2, Sector 1 , Noida -201301
            </li>
            <li>
              <a href="mailto:copyright@DeliveryPay.in">
                copyright@DeliveryPay.in
              </a>
            </li>
          </ul>
          <p>
            To be considered effective, a Counter-Notification must be submitted
            in writing and include the following information:
          </p>
          <ul>
            <li>
              Physical or electronic signature of the User or subscriber or a
              person authorized to act on behalf of the User or subscriber.
            </li>
            <li>
              Identification of the material that has been removed or to which
              access has been disabled and the location at which the material
              appeared before it was removed or access to it was disabled.
            </li>
            <li>
              A statement under penalty of perjury that the User or subscriber
              has a good faith belief that the material was removed or disabled
              as a result of mistake or misidentification of the material to be
              removed or disabled.
            </li>
            <li>
              The User’s or subscriber's name, address, and telephone number,
              and a statement that (1) the subscriber consents to the
              jurisdiction of (a) (for USA addresses) the Federal District Court
              for the United States of America’s judicial district in which the
              address is located, or (b) (for non-USA addresses) the Federal
              District Court for the Northern District of California, USA, and
              (2) the User or subscriber will accept service of process from the
              person who submitted the Notification of Claimed Infringement or
              an agent of such person.
            </li>
          </ul>
          <p>
            Please note that under Section 512(f) of the United States Copyright
            Act, any person who knowingly materially misrepresents that material
            or activity was removed or disabled by mistake or misidentification
            may be subject to liability.
          </p>
          <p>
            Please also be advised that we enforce a policy that provides for
            the termination, in appropriate circumstances, of Users or
            subscribers who are repeat infringers.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CopyrightPolicy;
